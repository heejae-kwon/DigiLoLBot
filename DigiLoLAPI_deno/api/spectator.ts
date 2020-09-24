import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import getSummoner from "../common/getSummoner.ts";
import getLeagueEntries from "../common/getLeagueEntries.ts";
import fixedEncodeURI from "../common/fixedEncodeURI.ts";
import ChampionIdMap from "../common/ChampionIdMap.ts";
import QueueTypeMap from "../common/QueueTypeMap.ts";

interface CurrentGameInfo {
  gameId: number; //The ID of the game
  gameType: string; //The game type
  gameStartTime: number; //The game start time represented in epoch milliseconds
  mapId: number; //The ID of the map
  gameLength: number; //The amount of time in seconds that has passed since the game started
  platformId: string; //The ID of the platform on which the game is being played
  gameMode: string; //The game mode
  bannedChampions: Array<BannedChampion>; //Banned champion information
  gameQueueConfigId: number; //The queue type (queue types are documented on the Game Constants page)
  observers: Observer; //The observer information
  participants: Array<CurrentGameParticipant>; //The participant information
}

interface BannedChampion {
  pickTurn: number; //The turn during which the champion was banned
  championId: number; //The ID of the banned champion
  teamId: number; //The ID of the team that banned the champion
}

interface Observer {
  encryptionKey: string;
}

interface CurrentGameParticipant {
  championId: number; //The ID of the champion played by this participant
  perks: Perks; //Perks/Runes Reforged Information
  profileIconId: number; //The ID of the profile icon used by this participant
  bot: boolean; //Flag indicating whether or not this participant is a bot
  teamId: number; //The team ID of this participant, indicating the participant's team
  summonerName: string; //The summoner name of this participant
  summonerId: string; //The encrypted summoner ID of this participant
  spell1Id: number; //The ID of the first summoner spell used by this participant
  spell2Id: number; //The ID of the second summoner spell used by this participant
  gameCustomizationObjects: Array<GameCustomizationObject>; //List of Game Customizations
}

interface Perks {
  perkIds: Array<number>; //IDs of the perks/runes assigned.
  perkStyle: number; //Primary runes path
  perkSubStyle: number; //Secondary runes path
}

interface GameCustomizationObject {
  category: string; //Category identifier for Game Customization
  content: string; //Game Customization content
}

const getCurrentGameInfo = async (
  encryptedId: String,
): Promise<CurrentGameInfo | null> => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedId}?api_key=${config.apikey}`,
      ),
    );
    return res.data as CurrentGameInfo;
  } catch (error) {
    console.log(error.response.data);
  }
  return null;
};

// response interface
interface ParticipantsData {
  championName: string;
  summonerName: string;
  tier: string;
  rank: string;
}
interface TeamData {
  teamName: "red" | "blue" | string;
  participants: ParticipantsData[];
  bannedChampions: string[];
}
interface SpectatorData {
  teams: TeamData[];
  gameStartTime: number;
  gameLength: number;
  queueType: string;
}
const router = new Router({ prefix: "/api" });
router.get("/spectator", async (ctx) => {
  let summonerName = ctx.request.url.searchParams.get("summonerName")!!;
  const summoner = await getSummoner(summonerName);
  if (!summoner) {
    ctx.response.body = { error: "Cannot get summoner data" };
    ctx.response.status = Status.NotFound;
    return;
  }
  const currentGameInfo = await getCurrentGameInfo(summoner.id);
  if (!currentGameInfo) {
    ctx.response.body = { error: "Cannot find current game info" };
    ctx.response.status = Status.NotFound;
    return;
  }
  if (
    currentGameInfo.gameQueueConfigId < 400 ||
    currentGameInfo.gameQueueConfigId > 450
  ) {
    ctx.response.body = { error: "Does not support this type of game" };
    ctx.response.status = Status.Forbidden;
    return;
  }
  const blueParticipants = Array<ParticipantsData>();
  const redParticipants = Array<ParticipantsData>();
  const blueBanList = Array<string>();
  const redBanList = Array<string>();

  for (const player of currentGameInfo.participants) {
    const playerObj: ParticipantsData = {
      championName: ChampionIdMap.getChampionName(player.championId)!!,
      summonerName: player.summonerName,
      tier: "",
      rank: "",
    };
    const leagueEntries = await getLeagueEntries(player.summonerId);
    const soloEntry = leagueEntries?.find((it) => {
      return it.queueType.toString().toLocaleLowerCase() ===
        "RANKED_SOLO_5x5".toLocaleLowerCase();
    });
    if (soloEntry) {
      playerObj.tier = soloEntry.tier;
      playerObj.rank = soloEntry.rank;
    }
    switch (player.teamId) {
      case 100:
        {
          blueParticipants.push(playerObj);
        }
        break;
      case 200:
        {
          redParticipants.push(playerObj);
        }
        break;
    }
  }

  for (const banChamp of currentGameInfo.bannedChampions) {
    if (banChamp.championId < 0) {
      continue;
    }
    const name = ChampionIdMap.getChampionName(banChamp.championId)!!;
    switch (banChamp.teamId) {
      case 100: {
        blueBanList.push(name);
        break;
      }
      case 200: {
        redBanList.push(name);
        break;
      }
    }
  }

  const blueObj: TeamData = {
    teamName: "blue",
    participants: blueParticipants,
    bannedChampions: blueBanList,
  };
  const redObj: TeamData = {
    teamName: "red",
    participants: redParticipants,
    bannedChampions: redBanList,
  };

  const teamObjList = Array<TeamData>(blueObj, redObj);

  ctx.response.body = {
    teams: teamObjList,
    gameStartTime: currentGameInfo.gameStartTime,
    gameLength: currentGameInfo.gameLength,
    queueType: QueueTypeMap.getQueueType(currentGameInfo.gameQueueConfigId),
  } as SpectatorData;
});

export default router;

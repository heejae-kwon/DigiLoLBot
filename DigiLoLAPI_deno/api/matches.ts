import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import getSummoner from "../common/getSummoner.ts";
import fixedEncodeURI from "../common/fixedEncodeURI.ts";
import ChampionIdMap from "../common/ChampionIdMap.ts";
import QueueTypeMap from "../common/QueueTypeMap.ts";

interface MatchlistDto {
  startIndex: number;
  totalGames: number;
  endIndex: number;
  matches: Array<MatchReferenceDto>;
}

interface MatchReferenceDto {
  gameId: number;
  role: string;
  season: number;
  platformId: string;
  champion: number;
  queue: number;
  lane: string;
  timestamp: number;
}

interface MatchDto {
  gameId: number;
  participantIdentities: Array<ParticipantIdentityDto>; //	Participant identity information. Participant identity information is purposefully excluded for custom games.
  queueId: number; //	Please refer to the Game Constants documentation.
  gameType: string; //	Please refer to the Game Constants documentation.
  gameDuration: number; //	Match duration in seconds.
  teams: Array<TeamStatsDto>; //	Team information.
  platformId: string; //	Platform where the match was played.
  gameCreation: number; //	Designates the timestamp when champion select ended and the loading screen appeared, NOT when the game timer was at 0:00.
  seasonId: number; //	Please refer to the Game Constants documentation.
  gameVersion: string; //	The major.minor version typically indicates the patch the match was played on.
  mapId: number; //	Please refer to the Game Constants documentation.
  gameMode: string; //	Please refer to the Game Constants documentation.
  participants: Array<ParticipantDto>; //	Participant information.
}

interface ParticipantIdentityDto {
  participantId: number;
  player: PlayerDto; //Player information not included in the response for custom matches. Custom matches are considered private unless a tournament code was used to create the match.
}

interface PlayerDto {
  profileIcon: number;
  accountId: string; //	Player's original accountId.
  matchHistoryUri: string;
  currentAccountId: string; //Player's current accountId when the match was played.
  currentPlatformId: string; //Player's current platformId when the match was played.
  summonerName: string;
  summonerId: string; //Player's summonerId (Encrypted)
  platformId: string; //Player's original platformId.
}

interface TeamStatsDto {
  owerKills: number; //Number of towers the team destroyed.
  riftHeraldKills: number; //Number of times the team killed Rift Herald.
  firstBlood: boolean; //Flag indicating whether or not the team scored the first blood.
  inhibitorKills: number; //Number of inhibitors the team destroyed.
  bans: Array<TeamBansDto>; //If match queueId has a draft, contains banned champion data, otherwise empty.
  firstBaron: boolean; //Flag indicating whether or not the team scored the first Baron kill.
  firstDragon: boolean; //Flag indicating whether or not the team scored the first Dragon kill.
  dominionVictoryScore: number; //For Dominion matches, specifies the po:number,s the team had at game end.
  dragonKills: number; //Number of times the team killed Dragon.
  baronKills: number; //Number of times the team killed Baron.
  firstInhibitor: boolean; //Flag indicating whether or not the team destroyed the first inhibitor.
  firstTower: boolean; //Flag indicating whether or not the team destroyed the first tower.
  vilemawKills: number; //Number of times the team killed Vilemaw.
  firstRiftHerald: boolean; //Flag indicating whether or not the team scored the first Rift Herald kill.
  teamId: number; //100 for blue side. 200 for red side.
  win: string; //string indicating whether or not the team won. There are only two values visibile in public match history. (Legal values: Fail, Win)
}

interface TeamBansDto {
  championId: number; //Banned championId.
  pickTurn: number; //Turn during which the champion was banned.
}

interface ParticipantDto {
  participantId: number;
  championId: number;
  runes: Array<RuneDto>; //List of legacy Rune information. Not included for matches played with Runes Reforged.
  stats: ParticipantStatsDto; //Participant statistics.
  teamId: number; //100 for blue side. 200 for red side.
  timeline: ParticipantTimelineDto; //Participant timeline data.
  spell1Id: number; //First Summoner Spell id.
  spell2Id: number; //Second Summoner Spell id.
  highestAchievedSeasonTier: string; //Highest ranked tier achieved for the previous season in a specific subset of queueIds, if any, otherwise null. Used to display border in game loading screen. Please refer to the Ranked Info documentation. (Legal values: CHALLENGER, MASTER, DIAMOND, PLATINUM, GOLD, SILVER, BRONZE, UNRANKED)
  masteries: Array<MasteryDto>; //List of legacy Mastery information. Not included for matches played with Runes Reforged.
}

interface MasteryDto {
  rank: number;
  masteryId: number;
}

interface RuneDto {
  runeId: number;
  rank: number;
}

interface ParticipantStatsDto {
  item0: number;
  item2: number;
  totalUnitsHealed: number;
  item1: number;
  largestMultiKill: number;
  goldEarned: number;
  firstInhibitorKill: boolean;
  physicalDamageTaken: number;
  nodeNeutralizeAssist: number;
  totalPlayerScore: number;
  champLevel: number;
  damageDealtToObjectives: number;
  totalDamageTaken: number;
  neutralMinionsKilled: number;
  deaths: number;
  tripleKills: number;
  magicDamageDealtToChampions: number;
  wardsKilled: number;
  pentaKills: number;
  damageSelfMitigated: number;
  largestCriticalStrike: number;
  nodeNeutralize: number;
  totalTimeCrowdControlDealt: number;
  firstTowerKill: boolean;
  magicDamageDealt: number;
  totalScoreRank: number;
  nodeCapture: number;
  wardsPlaced: number;
  totalDamageDealt: number;
  timeCCingOthers: number;
  magicalDamageTaken: number;
  largestKillingSpree: number;
  totalDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  neutralMinionsKilledTeamJungle: number;
  totalMinionsKilled: number;
  firstInhibitorAssist: boolean;
  visionWardsBoughtInGame: number;
  objectivePlayerScore: number;
  kills: number;
  firstTowerAssist: boolean;
  combatPlayerScore: number;
  inhibitorKills: number;
  turretKills: number;
  participantId: number;
  trueDamageTaken: number;
  firstBloodAssist: boolean;
  nodeCaptureAssist: number;
  assists: number;
  teamObjective: number;
  altarsNeutralized: number;
  goldSpent: number;
  damageDealtToTurrets: number;
  altarsCaptured: number;
  win: boolean;
  totalHeal: number;
  unrealKills: number;
  visionScore: number;
  physicalDamageDealt: number;
  firstBloodKill: boolean;
  longestTimeSpentLiving: number;
  killingSprees: number;
  sightWardsBoughtInGame: number;
  trueDamageDealtToChampions: number;
  neutralMinionsKilledEnemyJungle: number;
  doubleKills: number;
  trueDamageDealt: number;
  quadraKills: number;
  item4: number;
  item3: number;
  item6: number;
  item5: number;
  playerScore0: number;
  playerScore1: number;
  playerScore2: number;
  playerScore3: number;
  playerScore4: number;
  playerScore5: number;
  playerScore6: number;
  playerScore7: number;
  playerScore8: number;
  playerScore9: number;
  perk0: number; //Primary path keystone rune.
  perk0Var1: number; //Post game rune stats.
  perk0Var2: number; //Post game rune stats.
  perk0Var3: number; //Post game rune stats.
  perk1: number; //Primary path rune.
  perk1Var1: number; //Post game rune stats.
  perk1Var2: number; //Post game rune stats.
  perk1Var3: number; //Post game rune stats.
  perk2: number; //Primary path rune.
  perk2Var1: number; //Post game rune stats.
  perk2Var2: number; //Post game rune stats.
  perk2Var3: number; //Post game rune stats.
  perk3: number; //Primary path rune.
  perk3Var1: number; //Post game rune stats.
  perk3Var2: number; //Post game rune stats.
  perk3Var3: number; //Post game rune stats.
  perk4: number; //Secondary path rune.
  perk4Var1: number; //Post game rune stats.
  perk4Var2: number; //Post game rune stats.
  perk4Var3: number; //Post game rune stats.
  perk5: number; //Secondary path rune.
  perk5Var1: number; //Post game rune stats.
  perk5Var2: number; //Post game rune stats.
  perk5Var3: number; //Post game rune stats.
  perkPrimaryStyle: number; //Primary rune path
  perkSubStyle: number; //Secondary rune path
}

interface ParticipantTimelineDto {
  participantId: number;
  csDiffPerMinDeltas: Map<string, number>; //Creep score difference versus the calculated lane opponent(s) for a specified period.
  damageTakenPerMinDeltas: Map<string, number>; //Damage taken for a specified period.
  role: string; //Participant's calculated role. (Legal values: DUO, NONE, SOLO, DUO_CARRY, DUO_SUPPORT)
  damageTakenDiffPerMinDeltas: Map<string, number>; //Damage taken difference versus the calculated lane opponent(s) for a specified period.
  xpPerMinDeltas: Map<string, number>; //Experience change for a specified period.
  xpDiffPerMinDeltas: Map<string, number>; //Experience difference versus the calculated lane opponent(s) for a specified period.
  lane: string; //Participant's calculated lane. MID and BOT are legacy values. (Legal values: MID, MIDDLE, TOP, JUNGLE, BOT, BOTTOM)
  creepsPerMinDeltas: Map<string, number>; //Creeps for a specified period.
  goldPerMinDeltas: Map<string, number>; //Gold for a specified period.
}

const getMatches = async (
  encryptedAccountId: string,
): Promise<MatchReferenceDto[]> => {
  let matches: MatchReferenceDto[] = [];
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?api_key=${config.apikey}`,
      ),
    );
    matches = res.data.matches as MatchReferenceDto[];
  } catch (err) {
    console.log(err.response.data);
  }
  return matches;
};

const getGameData = async (matchId: number): Promise<MatchDto | null> => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${config.apikey}`,
      ),
    );
    return res.data as MatchDto;
  } catch (err) {
    console.log(err.reponse.data);
    return null;
  }
};

//response interface
interface MatchesData {
  icon: string;
  name: string;
  wins: number;
  loses: number;
  matches: MatchData[];
}
interface MatchData {
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  queueType: string;
}

const router = new Router({ prefix: "/api" });
router.get("/matches", async (ctx) => {
  let summonerName = ctx.request.url.searchParams.get("summonerName")!!;
  const summoner = await getSummoner(summonerName);
  if (!summoner) {
    ctx.response.body = { error: "Cannot get summoner data" };
    ctx.response.status = Status.NotFound;
    return;
  }
  const matches = await getMatches(summoner.accountId);

  const matchObjList = [] as object[];
  const matchSize = (matches.length > 10) ? 10 : matches.length;
  let winCount = 0;
  for (let i = 0; i < matchSize; ++i) {
    const match = matches[i];
    if (match.queue < 400 || match.queue > 450) {
      continue;
    }
    //queueType
    const champId = match.champion;
    const gameData = await getGameData(match.gameId);
    if (!gameData) {
      ctx.response.body = { error: "Cannot get game data" };
      ctx.response.status = Status.NotFound;
      return;
    }
    const champInfo = gameData.participants.find((it) =>
      it.championId === champId
    )!!;

    const matchObj: MatchData = {
      champion: ChampionIdMap.getChampionName(champId)!!,
      kills: champInfo?.stats.kills,
      deaths: champInfo?.stats.deaths,
      assists: champInfo?.stats.assists,
      win: champInfo?.stats.win,
      queueType: QueueTypeMap.getQueueType(match.queue)!!,
    };
    if (champInfo?.stats?.win!!) {
      ++winCount;
    }

    matchObjList.push(matchObj);
  }
  ctx.response.body = {
    icon: fixedEncodeURI(
      `https://ddragon.leagueoflegends.com/cdn/${config.gameVersion}/img/profileicon/${summoner.profileIconId}.png`,
    ),
    name: summoner.name,
    wins: winCount,
    loses: matchSize - winCount,
    matches: matchObjList,
  } as MatchesData;
});

export default router;

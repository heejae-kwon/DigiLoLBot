import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import { getSummoner, SummonerDTO } from "../common/getSummoner.ts";
import {
  getLeagueEntries,
  LeagueEntryDTO,
} from "../common/getLeagueEntries.ts";
import fixedEncodeURI from "../common/fixedEncodeURI.ts";
import ChampionIdMap from "../common/ChampionIdMap.ts";

interface ChampionMasteryDTO {
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  championId: number;
  lastPlayTime: number;
  championLevel: number;
  summonerId: string;
  championPoints: number;
  championPointsSinceLastLevel: number;
  tokensEarned: number;
}

const getBestChampionMastery = async (
  encryptedSummonerId: String,
): Promise<ChampionMasteryDTO> => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}?api_key=${config.apikey}`,
      ),
    );
    const masteries: ChampionMasteryDTO[] = res.data;
    return masteries[0];
  } catch (error) {
    throw error;
  }
};

//response interface
interface SearchSummonerData {
  icon: string;
  name: string;
  level: number;
  bestChampion: string;
  leagueEntries: LeagueEntryData[];
}
interface LeagueEntryData {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  loses: number;
  queueType: "Ranked Solo" | "Ranked Flex" | string;
}
const router = new Router({ prefix: "/api" });
router.get("/search-summoner", async (ctx) => {
  const summonerName = ctx.request.url.searchParams.get("summonerName")!!;
  let summoner: SummonerDTO;
  try {
    summoner = await getSummoner(summonerName);
  } catch (error) {
    ctx.response.body = {
      error: "Cannot get summoner data",
      api: error.response.data,
    };
    ctx.response.status = Status.NotFound;
    return;
  }
  let leagueEntries: LeagueEntryDTO[];
  try {
    leagueEntries = await getLeagueEntries(summoner.id);
  } catch (error) {
    ctx.response.body = {
      error: "Cannot get league entries",
      api: error.response.data,
    };
    ctx.response.status = Status.NotFound;
    return;
  }
  let bestChampMastery: ChampionMasteryDTO;
  try {
    bestChampMastery = await getBestChampionMastery(summoner.id);
  } catch (error) {
    ctx.response.body = {
      error: "Cannot get champion mastery",
      api: error.response.data,
    };
    ctx.response.status = Status.NotFound;
    return;
  }

  const rankList: Array<LeagueEntryData> = [];
  for (const entry of leagueEntries) {
    let queueType = "Ranked Flex";
    if (entry.queueType == "RANKED_SOLO_5x5") {
      queueType = "Ranked Solo";
    }
    const obj: LeagueEntryData = {
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      loses: entry.losses,
      queueType: queueType,
    };
    rankList.push(obj);
  }

  const bestChampion = ChampionIdMap.getChampionName(
    bestChampMastery.championId,
  );
  ctx.response.body = {
    icon: fixedEncodeURI(
      `https://ddragon.leagueoflegends.com/cdn/${config.gameVersion}/img/profileicon/${summoner.profileIconId}.png`,
    ),
    name: summoner.name,
    level: summoner.summonerLevel,
    bestChampion: fixedEncodeURI(
      `https://ddragon.leagueoflegends.com/cdn/${config.gameVersion}/img/champion/${bestChampion}.png`,
    ),
    leagueEntries: rankList,
  } as SearchSummonerData;
});
export default router;

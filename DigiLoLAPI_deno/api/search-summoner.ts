import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import getSummoner from "../common/getSummoner.ts";
import getLeagueEntries from "../common/getLeagueEntries.ts";
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
): Promise<ChampionMasteryDTO | null> => {
  try {
    const res = await axiod.get(
      `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}?api_key=${config.apikey}`,
    );
    const masteries: ChampionMasteryDTO[] = res.data;
    if (masteries.length > 0) {
      return masteries[0];
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

//response interface
interface SearchSummonerData {
  icon: number;
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
  let summonerName = ctx.request.url.searchParams.get("summonerName")!!;
  summonerName = summonerName?.replace(/ /gi, "%20");
  const summoner = await getSummoner(summonerName);
  if (!summoner) {
    ctx.response.body = { error: "Cannot get summoner data" };
    ctx.response.status = Status.NotFound;
    return;
  }
  const leagueEntries = await getLeagueEntries(summoner.id);
  if (!leagueEntries) {
    ctx.response.body = { error: "Cannot get league entries" };
    ctx.response.status = Status.NotFound;
    return;
  }
  const bestChampMastery = await getBestChampionMastery(summoner.id);
  if (!bestChampMastery) {
    ctx.response.body = { error: "Cannot get champion mastery" };
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

  ctx.response.body = {
    icon: summoner.profileIconId,
    name: summoner.name,
    level: summoner.summonerLevel,
    bestChampion: ChampionIdMap.getChampionName(bestChampMastery.championId),
    leagueEntries: rankList,
  } as SearchSummonerData;
});
export default router;

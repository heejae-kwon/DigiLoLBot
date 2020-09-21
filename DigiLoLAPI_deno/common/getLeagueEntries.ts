import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";

interface LeagueEntryDTO {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries: MiniSeriesDTO;
}

interface MiniSeriesDTO {
  losses: number;
  progress: number;
  target: number;
  wins: number;
}

const getLeagueEntries = async (
  encryptedSummonerId: string,
): Promise<LeagueEntryDTO[] | null> => {
  try {
    const res = await axiod.get(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${config.apikey}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default getLeagueEntries;

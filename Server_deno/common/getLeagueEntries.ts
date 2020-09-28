import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import fixedEncodeURI from "./fixedEncodeURI.ts";

export interface LeagueEntryDTO {
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

export const getLeagueEntries = async (
  encryptedSummonerId: string,
): Promise<LeagueEntryDTO[]> => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${config.apikey}`,
      ),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

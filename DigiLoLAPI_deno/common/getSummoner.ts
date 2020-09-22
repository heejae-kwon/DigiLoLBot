import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import fixedEncodeURI from "./fixedEncodeURI.ts";
interface SummonerDTO {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
}

const getSummoner = async (
  summonerName: string,
): Promise<SummonerDTO | null> => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${config.apikey}`,
      ),
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default getSummoner;

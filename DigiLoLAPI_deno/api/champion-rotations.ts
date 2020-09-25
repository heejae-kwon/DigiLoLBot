import { HttpError, Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import ChampionIdMap from "../common/ChampionIdMap.ts";
import fixedEncodeURI from "../common/fixedEncodeURI.ts";
import config from "../config.ts";

interface ChampionInfo {
  maxNewPlayerLevel: number;
  freeChampionIdsForNewPlayers: Array<number>;
  freeChampionIds: Array<number>;
}

//response interface
interface ChampionRotationsData {
  championRotations: string[];
}

const router = new Router({ prefix: "/api" });
router.get("/champion-rotations", async (ctx) => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${config.apikey}`,
      ),
    );
    const championInfo: ChampionInfo = res.data;
    const championRotations: Array<string> = [];
    championInfo.freeChampionIds.forEach((champId) => {
      championRotations.push(ChampionIdMap.getChampionName(champId)!!);
    });
    ctx.response.body = { championRotations } as ChampionRotationsData;
  } catch (error) {
    console.log(error.response.data);
    ctx.response.body = { error: "Fail getting rotations" };
    ctx.response.status = Status.NotFound;
  }
});

export default router;

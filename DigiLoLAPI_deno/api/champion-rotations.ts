import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import ChampionIdMap from "../common/ChampionIdMap.ts";
import config from "../config.ts";

interface ChampionInfo {
  maxNewPlayerLevel: number;
  freeChampionIdsForNewPlayers: Array<number>;
  freeChampionIds: Array<number>;
}

const router = new Router({ prefix: "/api" });
router.get("/champion-rotations", async (ctx) => {
  try {
    const res = await axiod.get(
      `https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${config.apikey}`,
    );
    const championInfo: ChampionInfo = res.data;
    const championRotation: Array<string> = [];
    championInfo.freeChampionIds.forEach((champId) => {
      championRotation.push(ChampionIdMap.getChampionName(champId)!!);
    });
    ctx.response.body = { championRotation };
  } catch (error) {
    console.log(error);
    ctx.response.body = { error: "Fail getting rotations" };
    ctx.response.status = Status.NotFound;
  }
});

export default router;

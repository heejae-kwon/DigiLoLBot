import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import championRotationRouter from "./api/champion-rotations.ts";
import serverStatusRouter from "./api/server-status.ts";
import summonerRouter from "./api/search-summoner.ts";
import matchesRouter from "./api/matches.ts";
import ChampionIdMap from "./common/ChampionIdMap.ts";
import QueueTypeMap from "./common/QueueTypeMap.ts";

const main = async () => {
  try {
    const app = new Application();
    const router = new Router();

    await ChampionIdMap.init();
    await QueueTypeMap.init();

    router.get("/api", (ctx) => {
      ctx.response.body = "API is working!";
    });

    router.get("/", (ctx) => {
      ctx.response.body = "Server is working!";
    });

    app.use(router.routes());
    app.use(championRotationRouter.routes());
    app.use(serverStatusRouter.routes());
    app.use(summonerRouter.routes());
    app.use(matchesRouter.routes());

    await app.listen({ port: 8000 });
  } catch (error) {
    console.log(error);
  }
};

main();

import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import fixedEncodeURI from "./fixedEncodeURI.ts";
class ChampionIdMap {
  private map: Map<number, string>;
  constructor() {
    this.map = new Map<number, string>();
  }
  async init() {
    try {
      const res = await axiod.get(
        fixedEncodeURI(
          `https://ddragon.leagueoflegends.com/cdn/${config.gameVersion}/data/en_US/champion.json`,
        ),
      );
      const championData = res.data.data;
      for (const key in championData) {
        this.map.set(parseInt(championData[key].key), key.toString());
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
  getChampionName(chapionId: number) {
    return this.map.get(chapionId);
  }
}

export default new ChampionIdMap();

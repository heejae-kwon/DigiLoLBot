import axiod from "https://deno.land/x/axiod/mod.ts";
class ChampionIdMap {
  private map: Map<number, string>;
  constructor() {
    this.map = new Map<number, string>();
  }
  async init() {
    try {
      const res = await axiod.get(
        "https://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/champion.json",
      );
      const championData = res.data.data;
      for (const key in championData) {
        this.map.set(parseInt(championData[key].key), key.toString());
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  getChampionName(chapionId: number) {
    return this.map.get(chapionId);
  }
}

export default new ChampionIdMap();

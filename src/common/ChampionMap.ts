import axios from 'axios'

class ChampionMap {
  private championMap: Map<number, any>;
  constructor() {
    this.championMap = new Map<number, any>();
  }

  async init() {
    const res = await axios.get('http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/champion.json');
    const championJson = res.data.data;

    for (const key in championJson) {
      const champ = championJson[key]
      const champName: string = key;
      this.championMap.set(parseInt(champ.key), champName)
    }
  }
  get() {
    return this.championMap;
  }

}

export default new ChampionMap; 

import axiod from "https://deno.land/x/axiod/mod.ts";
import fixedEncodeURI from "./fixedEncodeURI.ts";
class QueueTypeMap {
  private map: Map<number, string>;
  constructor() {
    this.map = new Map<number, string>();
  }
  async init() {
    try {
      const res = await axiod.get(
        fixedEncodeURI(
          "https://static.developer.riotgames.com/docs/lol/queues.json",
        ),
      );
      const queueList: any[] = res.data;
      for (let queueObj of queueList) {
        if (400 <= queueObj.queueId && queueObj.queueId <= 450) {
          let description: string = queueObj.description;
          description = description.replace(" games", "");
          description = description.replace("5v5 ", "");
          this.map.set(queueObj.queueId, description);
        }
      }
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }
  getQueueType(queueId: number) {
    return this.map.get(queueId);
  }
}

export default new QueueTypeMap();

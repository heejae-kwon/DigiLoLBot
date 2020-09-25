import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import config from "../config.ts";
import fixedEncodeURI from "../common/fixedEncodeURI.ts";

interface SharedStatus {
  locales: Array<string>;
  hostname: string;
  name: string;
  services: Array<Service>;
  slug: string;
  region_tag: string;
}

interface Service {
  incidents: Array<Incident>;
  name: string;
  slug: string;
  status: string;
}

interface Incident {
  active: boolean;
  created_at: string;
  id: string;
  updates: Array<Message>;
}

interface Message {
  severity: string;
  updated_at: string;
  author: string;
  translations: Array<Translation>;
  created_at: string;
  id: string;
  content: string;
}
interface Translation {
  updated_at: string;
  locale: string;
  content: string;
}

//response body interface
interface ServiceStatusData {
  services: ServiceData[];
}
interface ServiceData {
  name: string;
  status: string;
  messages: string[];
}

const router = new Router({ prefix: "/api" });
router.get("/service-status", async (ctx) => {
  try {
    const res = await axiod.get(
      fixedEncodeURI(
        `https://kr.api.riotgames.com/lol/status/v3/shard-data?api_key=${config.apikey}`,
      ),
    );
    const returnObj = { services: [] as ServiceData[] };
    const sharedStatus: SharedStatus = res.data;
    const services = sharedStatus.services;
    services.forEach((service) => {
      const statusMessage: Array<string> = [];
      service.incidents.forEach((incident) => {
        statusMessage.push(incident.updates[0].content);
      });
      returnObj.services.push({
        name: service.name,
        status: service.status,
        messages: statusMessage,
      });
    });
    ctx.response.body = returnObj as ServiceStatusData;
  } catch (error) {
    console.log(error.response.data);
    ctx.response.body = { error: "Fail getting server status" };
    ctx.response.status = Status.NotFound;
  }
});

export default router;

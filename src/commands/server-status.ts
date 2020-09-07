

import { Client, Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import config from '../config.json'

interface IIncident {
  id: number,
  active: boolean,
  created_at: string,
  updates: Array<any>
}

interface IServices {
  name: string,
  slug: string,
  status: string,
  incidents: Array<IIncident>
}

const serverStatus = async (client: Client, msg: Message, args: string[]) => {

  const axiosRes = await axios.get("https://kr.api.riotgames.com/lol/status/v3/shard-data?api_key=" + config.apikey);
  const services: Array<IServices> = axiosRes.data.services;

  const embed = new MessageEmbed()
    // Set the title of the field
    .setTitle(`리그 오브 레전드 서비스 상태`)
    // Set the color of the embed
    .setColor(0xff0000)
    .setDescription("Sex");

  services.forEach((service) => {
    let content = ""
    if (service.incidents.length !== 0) {
      service.incidents.forEach((incident) => {
        content += incident.updates[0].content + '\n';
      });
    }
    embed.addField(service.name, content, true);

  });

  msg.channel.send(embed);
}

export default serverStatus;

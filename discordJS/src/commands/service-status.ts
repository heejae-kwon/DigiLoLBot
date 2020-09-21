import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import converter from "number-to-words";

//response body interface
interface ServiceStatusData {
  services: ServiceData[];
}
interface ServiceData {
  name: string;
  status: string;
  messages: string[];
}

const serviceStatus = async (client: Client, msg: Message, args: string[]) => {
  try {
    const axiosRes = await axios.get(`${config.server}/api/service-status`);
    const services = (axiosRes.data as ServiceStatusData).services;

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`리그 오브 레전드 서비스 상태`)
      // Set the color of the embed
      .setColor(0x00FF00)
      .setDescription("");

    services.forEach((service) => {
      let content = "OK";
      if (service.messages.length !== 0) {
        content = "";
        for (let i = 0; i < service.messages.length; ++i) {
          content += `:${converter.toWords(i + 1)}: ${service.messages[i]}\n\n`;
        }
      }
      let statusColor = "green";
      if (service.status.toLocaleLowerCase() !== "online") {
        statusColor = "red";
        embed.setColor(0xFF0000);
      }
      embed.addField(`:${statusColor}_circle: ${service.name}`, content, false);
    });

    msg.channel.send(embed);
  } catch (error) {
    console.log(error);
  }
};

export default serviceStatus;

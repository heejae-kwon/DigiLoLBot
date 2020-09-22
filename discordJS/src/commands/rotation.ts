import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import fixedEncodeURI from "../common/fixedEncodeURI";

//response interface
interface ChampionRotationsData {
  championRotations: string[];
}

const rotation = async (client: Client, msg: Message, args: string[]) => {
  try {
    const axiosRes = await axios.get(
      fixedEncodeURI(`${config.server}/api/champion-rotations`),
    );
    const championRotations =
      (axiosRes.data as ChampionRotationsData).championRotations;

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`이번주 로테이션`)
      // Set the color of the embed
      .setColor(0xff0000);
    // Set the main content of the embed
    //     .setDescription(desc);

    championRotations.forEach((champName) => {
      let name = "";
      const emoji = (client.emojis.cache.find((emo) => emo.name === champName));
      let val = "";
      for (let i = 0; i < champName.length; ++i) {
        val += emoji?.toString();
      }
      for (const char of Array.from(champName)) {
        name += `:regional_indicator_${char.toLowerCase()}:`;
      }
      embed.addField(name, val, false);
    });

    msg.channel.send(embed);
  } catch (error) {
    console.log(error);
  }
};

export default rotation;

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
      .setTitle(`This week's rotation`)
      .setColor(0xff0000);

    championRotations.forEach((champName) => {
      const champNameLowerCase = champName.toLocaleLowerCase();
      let name = "";
      const emoji = (client.emojis.cache.find((emo) =>
        emo.name.toLocaleLowerCase() === champNameLowerCase
      ));
      let val = "";
      for (let i = 0; i < champName.length; ++i) {
        val += emoji?.toString();
      }
      for (const char of Array.from(champNameLowerCase)) {
        name += `:regional_indicator_${char}:`;
      }
      embed.addField(name, val, false);
    });

    msg.channel.send(embed);
  } catch (error) {
    const errorMsg = new MessageEmbed()
      .setDescription(
        "```json\n" + `${JSON.stringify(error.response.data, null, 2)}` + "```",
      );
    msg.channel.send(errorMsg);
  }
};

export default rotation;

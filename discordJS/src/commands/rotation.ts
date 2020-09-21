import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";

//response interface
interface ChampionRotationsData {
  championRotations: string[];
}

const rotation = async (client: Client, msg: Message, args: string[]) => {
  try {
    const axiosRes = await axios.get(
      `${config.server}/api/champion-rotations`,
    );
    const championRotations =
      (axiosRes.data as ChampionRotationsData).championRotations;

    let desc = "";

    championRotations.forEach((champName) => {
      const emoji = (client.emojis.cache.find((emo) =>
        emo.name === champName
      ));
      desc += `${emoji?.toString()}`;
    });

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`이번주 로테이션`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription(desc);
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
  } catch (error) {
    console.log(error);
  }
};

export default rotation;

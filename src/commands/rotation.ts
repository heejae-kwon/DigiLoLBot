
import { Client, Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import ChampionMap from '../common/ChampionMap'

const rotation = async (client: Client, msg: Message, args: string[]) => {

  const axiosRes = await axios.get("https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-413f33db-1f77-4e29-9b69-886499d3d083");
  const freeChampionIds: Array<number> = axiosRes.data.freeChampionIds;

  let desc = "";

  freeChampionIds.forEach(id => {
    const champName = ChampionMap.get().get(id);
    const emoji = (client.emojis.cache.find(emo => emo.name === champName));
    desc += `${emoji?.toString()}`;
  });

  const embed = new MessageEmbed()
    // Set the title of the field
    .setTitle(`This week's roatation`)
    // Set the color of the embed
    .setColor(0xff0000)
    // Set the main content of the embed
    .setDescription(desc);
  // Send the embed to the same channel as the message
  msg.channel.send(embed);
}

export default rotation;

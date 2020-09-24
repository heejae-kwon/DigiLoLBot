import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import fixedEncodeURI from "../common/fixedEncodeURI";

//response body interface

interface SearchSummonerData {
  icon: string;
  name: string;
  level: number;
  bestChampion: string;
  leagueEntries: LeagueEntryData[];
}
interface LeagueEntryData {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  loses: number;
  queueType: "Ranked Solo" | "Ranked Flex" | string;
}

const searchSummoner = async (client: Client, msg: Message, args: string[]) => {
  try {
    let userName = args[0];
    for (let i = 1; i < args.length; ++i) {
      userName += ` ${args[i]}`;
    }
    const requestUrl = fixedEncodeURI(
      `${config.server}/api/search-summoner?summonerName=${userName}`,
    );
    const axiosRes = await axios.get(
      requestUrl,
    );
    const summoner = (axiosRes.data as SearchSummonerData);

    const embed = new MessageEmbed()
      .setColor(0x0099ff)
      .setAuthor(
        `${summoner.name} Lv ${summoner.level}`,
        `${summoner.icon}`,
        fixedEncodeURI(`https://www.op.gg/summoner/userName=${summoner.name}`),
      )
      .setThumbnail(`${summoner.bestChampion}`);

    summoner.leagueEntries.forEach((entry) => {
      const emoji = (client.emojis.cache.find((emo) =>
        emo.name.toLocaleLowerCase() === entry.tier.toLocaleLowerCase()
      ));
      const percentage = entry.wins + entry.loses !== 0
        ? entry.wins / (entry.wins + entry.loses)
        : 0;
      const entryValue = "`" +
        `${entry.tier} ${entry.rank} ${entry.leaguePoints}LP` +
        `\n${entry.wins}W ${entry.loses}L ${(percentage * 100).toFixed(1)}%` +
        "`";
      embed.addField(
        emoji?.toString() + " " + entry.queueType,
        entryValue,
        true,
      );
    });

    msg.channel.send(embed);
  } catch (error) {
    console.log(error);
  }
};

export default searchSummoner;

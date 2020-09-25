import { Client, Emoji, HTTPError, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import fixedEncodeURI from "../common/fixedEncodeURI";
import { toArabic, toRoman } from "roman-numerals";
import converter from "number-to-words";

// response interface
interface ParticipantsData {
  championName: string;
  summonerName: string;
  tier: string;
  rank: string;
}
interface TeamData {
  teamName: "red" | "blue" | string;
  participants: ParticipantsData[];
  bannedChampions: string[];
}
interface SpectatorData {
  teams: TeamData[];
  gameStartTime: number;
  gameLength: number;
  queueType: string;
}

const spectator = async (client: Client, msg: Message, args: string[]) => {
  try {
    let userName = args[0];
    for (let i = 1; i < args.length; ++i) {
      userName += ` ${args[i]}`;
    }
    const axiosRes = await axios.get(
      fixedEncodeURI(
        `${config.server}/api/spectator?summonerName=${userName}`,
      ),
    );
    const spectatorData = (axiosRes.data as SpectatorData);

    const embed = new MessageEmbed()
      .setColor(0x000000)
      .setTitle("Summoner's Rift")
      .setDescription(
        spectatorData.queueType + " " +
          new Date(spectatorData.gameLength * 1000).toISOString().substr(11, 8),
      );

    spectatorData.teams.forEach((team) => {
      let fieldValue = "";
      for (const player of team.participants) {
        const champEmoji = client.emojis.cache.find((emo) => {
          return emo.name.toLocaleLowerCase() ===
            player.championName.toLocaleLowerCase();
        });
        const tierEmoji = client.emojis.cache.find((emo) => {
          return emo.name.toLocaleLowerCase() ===
            player.tier.toLocaleLowerCase();
        }) || ":regional_indicator_u:";
        const rankEmoji = player.rank.length > 0
          ? `:${converter.toWords(toArabic(player.rank))}:`
          : ":regional_indicator_r:";
        const summonerName = player.summonerName.toLocaleLowerCase() ===
            userName.toLocaleLowerCase()
          ? "**`" + player.summonerName + "`**"
          : "`" + player.summonerName + "`";

        fieldValue += `${champEmoji?.toString()} ${tierEmoji?.toString()}` +
          `${rankEmoji} ` +
          summonerName + "\n";
      }
      fieldValue += "\n";
      for (const banChamp of team.bannedChampions) {
        fieldValue += client.emojis.cache.find((emo) => {
          return emo.name.toLocaleLowerCase() === banChamp.toLocaleLowerCase();
        })?.toString();
      }
      embed.addField(team.teamName.toLocaleUpperCase(), fieldValue, true);
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

export default spectator;

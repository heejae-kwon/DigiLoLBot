import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import converter from "number-to-words";
import fixedEncodeURI from "../common/fixedEncodeURI";

//response interface
interface MatchesData {
  icon: string;
  name: string;
  wins: number;
  loses: number;
  matches: MatchData[];
}
interface MatchData {
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  queueType: string;
}

const matches = async (client: Client, msg: Message, args: string[]) => {
  try {
    let userName = args[0];
    for (let i = 1; i < args.length; ++i) {
      userName += ` ${args[i]}`;
    }
    const axiosRes = await axios.get(
      fixedEncodeURI(
        `${config.server}/api/matches?summonerName=${userName}`,
      ),
    );
    const matchesData = (axiosRes.data as MatchesData);
    //const opggUserName = summoner.name.replace(/ /gi, "+");

    const embed = new MessageEmbed()
      .setColor(0x0099ff)
      .setAuthor(
        `${matchesData.name}`,
        `${matchesData.icon}`,
        fixedEncodeURI(
          `https://www.op.gg/summoner/userName=${matchesData.name}`,
        ),
      );

    let fieldValue = "";
    matchesData.matches.forEach((match) => {
      const winEmoji = match.win
        ? ":regional_indicator_w:"
        : ":regional_indicator_l:";
      let kda = match.deaths === 0
        ? "Perfect"
        : ((match.kills + match.assists) / match.deaths).toFixed(2);
      while (kda.length < 7) {
        kda += " ";
      }
      const emoji = (client.emojis.cache.find((emo) =>
        emo.name === match.champion
      ));
      let kdaStr = `${match.kills}/${match.deaths}/${match.assists}`;
      while (kdaStr.length < 8) {
        kdaStr += " ";
      }

      fieldValue += `${winEmoji} ${emoji?.toString()}` + "`" + kdaStr +
        `\t${kda}  ${match.queueType}` + "`\n";
    });

    const name = `${matchesData.wins + matchesData.loses}G ` +
      `${matchesData.wins}W ` + `${matchesData.loses}L`;
    embed.addField(name, fieldValue, false);

    msg.channel.send(embed);
  } catch (error) {
    console.log(error);
  }
};

export default matches;

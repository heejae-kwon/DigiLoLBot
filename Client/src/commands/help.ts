import { Client, Message, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "../config";
import fixedEncodeURI from "../common/fixedEncodeURI";

const help = async (client: Client, msg: Message, args: string[]) => {
  const embed = new MessageEmbed()
    .setTitle(`Usage`)
    .setAuthor(
      "희재토토",
      fixedEncodeURI(
        "https://avatars0.githubusercontent.com/u/27145146?s=400&u=0c35a305ac3485abb3338d77cb9142e883047259&v=4",
      ),
    )
    .setColor(0xff0000)
    .addFields(
      {
        name: "-r, --rotation",
        value: "Show champion rotation",
        inline: false,
      },
      {
        name: "-s, --server-status",
        value: "Show current server status",
        inline: true,
      },
      {
        name: "-u, --user <summoner>",
        value: "Show summoner's information",
        inline: false,
      },
      {
        name: "-m, --match <summoner>",
        value: "Show summoner's game records",
        inline: true,
      },
      {
        name: "-w, --watch <summoner>",
        value: "Show summoner's current game data",
        inline: false,
      },
      { name: "-h, --help", value: "Show help for a command", inline: true },
    );

  msg.channel.send(embed);
};

export default help;

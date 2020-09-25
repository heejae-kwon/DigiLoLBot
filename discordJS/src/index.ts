import Discord from "discord.js";
import rotation from "./commands/rotation";
import serviceStatus from "./commands/service-status";
import searchSummoner from "./commands/search-summoner";
import matches from "./commands/matches";
import config from "./config";
import spectator from "./commands/spectator";
import help from "./commands/help";

const main = async () => {
  console.log(config);
  const client = new Discord.Client();
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("message", async (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;
    if (msg.content.slice(0, config.prefix.length) !== config.prefix) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLocaleLowerCase();

    switch (command) {
      case "-r":
      case "--rotation":
        {
          await rotation(client, msg, args);
        }
        break;
      case "-s":
      case "--server-status":
        {
          await serviceStatus(client, msg, args);
        }
        break;
      case "-u":
      case "--user":
        {
          await searchSummoner(client, msg, args);
        }
        break;
      case "-m":
      case "--match":
        {
          await matches(client, msg, args);
        }
        break;
      case "-w":
      case "--watch":
        {
          await spectator(client, msg, args);
        }
        break;
      case "-h":
      case "--help":
        {
          await help(client, msg, args);
        }
        break;
      default: {
        const newMsg = new Discord.MessageEmbed().setDescription(
          `Invalid command: ${command}. Try type "dlb -h"`,
        );
        msg.channel.send(newMsg);
      }
    }
  });

  await client.login(config.token);
};

main();

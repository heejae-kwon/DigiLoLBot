import Discord from "discord.js";
import rotation from "./commands/rotation";
import serverStatus from "./commands/service-status";
import config from "./config";

const main = async () => {
  console.log(config);
  const client = new Discord.Client();
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("message", (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;
    if (msg.content.slice(0, config.prefix.length) !== config.prefix) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case "로테이션":
        {
          rotation(client, msg, args);
        }
        break;
      case "서버상태":
        {
          serverStatus(client, msg, args);
        }
        break;
    }
  });

  client.login(config.token);
};

main();

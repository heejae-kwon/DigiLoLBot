import Discord from 'discord.js';
import config from './config.json';
import ChampionMap from './common/ChampionMap'
import rotation from './commands/rotation'


const main = async () => {
  const client = new Discord.Client();
  await ChampionMap.init()
  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('message', msg => {
    if (msg.author.bot) { return; }
    if (!msg.content.startsWith(config.prefix)) { return; }
    if (msg.content.slice(0, config.prefix.length) !== config.prefix) { return; }

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case 'rotation': {
        rotation(client, msg, args);
      } break;

    }
  });

  client.login(config.token);
}

main()

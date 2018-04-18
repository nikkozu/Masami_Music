const Discord = require("discord.js");
const cfg = require("./config.json");
const music = new Discord.Client({disableEveryone: true});
const fs = require("fs");
music.commands = new Discord.Collection();
const {color} = require('./config.json');
const queue = new Map();

music.on('message', async message => {
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
	  if (!prefixes[message.guild.id]) {
		prefixes[message.guild.id] = {
			prefixes: cfg.prefix
		};
    }

    let prefix = prefixes[message.guild.id].prefixes;
    let msg = message.content.toLowerCase();
    let sender = message.author;
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();

    if (!msg.startsWith(prefix)) return;
    if (sender.bot) return;
    
    try {
        let commandFile = require(`./commands/${cmd}.js`); 
        commandFile.run(music, message, args, color, queue); 
    } catch(e) { 
        console.log(e.message); 
    } finally { 
        console.log(`${message.author.username} ran the command: ${cmd} on ${message.guild.name}`);
	}
});

music.login(process.env.TOKEN);

music.on('ready', async () => {
    console.log(`${music.user.username} is online!`);
});

const Discord = require("discord.js");
const cfg = require("./config.json");
const fs = require("fs");
music.commands = new Discord.Collection();
const {color} = require('./config.json');

fs.readdir("./commands/", (err, files) => {

	if (err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}

	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		music.commands.set(props.help.name, props);
	});
});

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

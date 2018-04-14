const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (music, message, args, color) => {
	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("Sorry you can't do that!").then(msg => msg.delete(3000));
	if (!args[0]) return message.channel.send(`Please input new prefix`).then(msg => msg.delete(3000));
	let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

	prefixes[message.guild.id] = {
		prefixes: args[0]
	};

	fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
		if (err) console.log(err);
	});
  console.log(args[0])
}

exports.help = {
	name: "prefix",
	description: "change default prefix for masamiBot",
	usage: `ms!prefix !`
}

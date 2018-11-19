const Discord = require('discord.js');
const client = new Discord.Client();
var mainNames = []
var subNames = []
client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', function (user, userID, channelID, message, evt) {
     if (message.content.substring(0, 1) == '!')  {
    	message.reply('pong');
  	}
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

const Discord = require('discord.js');
const client = new Discord.Client();
var main-names = []
var all-names = [] // array of tuple-like arrays to associate all names with a main name [side-name, main-names index]
client.on('ready', () => {
    console.log('Bot is connected');
});

client.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 2) == "$$") {
        var args = message.substring(2).split(' '); //cuts off $$
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'record_name':
                bot.sendMessage({
                    to: channelID,
                    message: 'recorded new character by name !' + args[1]
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

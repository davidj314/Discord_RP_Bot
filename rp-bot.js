const Discord = require('discord.js');
const client = new Discord.Client();

var mainnames = [];
var sidenames = [];

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content.substring(0,2) === '$$') {
    	var args = message.content.substring(2).split(' ');
        var command = args[0];
        switch(command){
            case 'record_name':
                var name = '';
                var i;
                for (i=1;i < args.length-1; i++){
                    name+= args[i];
                }
                message.channel.send(name);
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

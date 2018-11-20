const Discord = require('discord.js');
const client = new Discord.Client();
var pg = require('pg');

var make_table = "CREATE TABLE Info ( ID int NOT NULL, LookupKey varchar(255) NOT NULL, Info_Value varchar(255),PRIMARY KEY (ID));"

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query(make_table, function(err, result) {
    done();
    if(err) return console.error(err);
  });
    
    
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
                for (i=1;i < args.length; i++){
                    name+= args[i];
                }
                
                if (name != ''){
                    mainnames.push(name);
                    var allNames = '';
                    var j;
                    for (j = 0 ; j < mainnames.length ; j++)
                    {
                        allNames += mainnames[j] + ' ';
                    }
                    
                    message.channel.send(allNames);
                }
                console.log('name sent');
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

const Discord = require('discord.js');
const Client = new Discord.Client();
var pg = require('pg');
var pg_client = new pg.Client(process.env.DATABASE_URL);
pg_client.connect();
var make_table = "CREATE TABLE Info ( ID int NOT NULL, LookupKey varchar(255) NOT NULL, Info_Value varchar(255),PRIMARY KEY (ID));";

pg_client.query(make_table);

    
    
var mainnames = [];
var sidenames = [];

Client.on('ready', () => {
    console.log('I am ready!');
});

Client.on('message', message => {
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
Client.login(process.env.BOT_TOKEN);

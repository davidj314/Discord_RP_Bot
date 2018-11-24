/*const Discord = require('discord.js');
const Client = new Discord.Client();
var pg = require('pg');
var connection_string="postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319@ec2-54-225-110-156.compute-1.amazonaws.com:5432/dcaet7lhppmpnr"
var pg_client = new pg.Client(connection_string);
pg_client.connect();

function add_info(k, v){
    var insert_query = "INSERT INTO Info (InfoKey, InfoValue) VALUES($1, $2) RETURNING *";
    var values = [k, v];
    pg_client.query(insert_query, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
    
  } //end else
})//end query
    
}//end function


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
                break;
            case 'record_info':
                if (args.length < 3) return; //must have a key and value following command
                var info_key = args[1];
                var info_content = '';
                var i;
                for (i=2;i < args.length; i++){
                    info_content += args[i];
                }
                add_info(info_key, info_content);
                break;
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);
*/


const Discord = require('discord.js');
const Client = new Discord.Client();
console.log(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);
//postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16
//c7ace8802f4cc43d95ee42e1bbc319@ec2-54-225-110-156.compute-1.amazonaws.com:5432/dcaet7lhppmpnr
//var connectionString = "postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319
//@*HOST*:*PORT*/*DATABASE*"
var pg = require('pg');
var pg_client = new pg.Client(process.env.DATABASE_URL+"?ssl=true");
pg_client.connect();

    
    
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

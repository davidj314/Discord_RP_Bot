/*const Discord = require('discord.js');
const Client = new Discord.Client();
var pg = require('pg');
var connection_string="postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319@ec2-54-225-110-156.compute-1.amazonaws.com:5432/dcaet7lhppmpnr"
var pg_client = new pg.Client(connection_string);
pg_client.connect();




var mainnames = [];
var sidenames = [];

Client.on('ready', () => {
    console.log('I am ready!');
});



// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);
*/


function add_info(k, v){
    console.log('in the add info function');
    const  pg  = require('pg');
    const pg_client = new pg.Client(process.env.DATABASE_URL);

    pg_client.connect().connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})
    var endTime = new Date().getTime() + 5000;
    console.log('starting count');
    while (new Date().getTime() < endTime)
    {
     continue;    
    }
    console.log('5 seconds later...');
    var insert_query = "INSERT INTO Info (InfoKey, InfoValue) VALUES($1, $2)";
    var values = [k, v];
    console.log(values);
    pg_client.query(insert_query, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('success?')
    
  } //end else
})//end query
    console.log('ending connection');
    pg_client.end();
    
}//end function


const Discord = require('discord.js');
const Client = new Discord.Client();
console.log(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);
//postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16
//c7ace8802f4cc43d95ee42e1bbc319@ec2-54-225-110-156.compute-1.amazonaws.com:5432/dcaet7lhppmpnr
//var connectionString = "postgres://tfxdiyrtqafcsg:016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319
//@*HOST*:*PORT*/*DATABASE*"




Client.on('ready', () => {
    console.log('I am ready!');
});

Client.on('message', message => {
    if (message.content.substring(0,2) === '$$') {
    	var args = message.content.substring(2).split(' ');
        var command = args[0];
        switch(command){
            case 'record_name':
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

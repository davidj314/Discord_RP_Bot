const Discord = require('discord.js');
const Client = new Discord.Client();
var pg = require('pg');
var pg_client = new pg.Client(process.env.DATABASE_URL);
pg_client.connect();
 
function add_info(k, v){
    var insert_query = "INSERT INTO Info (LookupKey, Info_Value) VALUES($1, $2) RETURNING *";
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

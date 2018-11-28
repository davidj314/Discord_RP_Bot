function add_info(k, v){
    console.log('in the add info function');
    var  pg  = require('pg');
    var insert_query = "INSERT INTO Testimundo (InfoKey, InfoValue) VALUES($1, $2)";
    var values = [k, v];
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in add info');
// connection using created pool
pool.query(insert_query, values,  (err, res) => {
  console.log(err, res);
  pool.end();
});
}
    
function get_all_infos(){
    console.log('getting all infos');
    var select_query = "SELECT * FROM Testimundo";
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in get all info');
// connection using created pool
pool.query(select_query,(err, result) => {
  if (err) {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);;
  }
  console.log('no error');
  console.log(result.rows); 
});

    
}//end function


function convert_to_userid(guildList, input)
{
    guildList.forEach(function(guildMember)
    {
        if (guildMember.user.username == input)
        {
            return guildMember.user.id  ; 
        }
           
        if (guildMember.user.nickname == input)
        {
            return guildMember.user.id  ;   
        }
        
        if (guildMember.user.id == input)
        {
            return guildMember.user.id;
        }
    });//end forEach
}//end function


var Discord = require('discord.js');
var Client = new Discord.Client();
 var Momo = require('pg');
var constring = process.env.DATABASE_URL + "?ssl=true";
var MO = new Momo.Client();

Client.on('ready', () => {
    console.log('I am ready!');

});




Client.on('message', message => {
    if (message.content.substring(0,2) === '$$') {
        message.reply(convert_to_userid(message.guild.members, 'drake852456'));
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
            case 'get_infos':
                get_all_infos();
                break;
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

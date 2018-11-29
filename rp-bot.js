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

function make_main_names(){
    var ceate_query = "DROP TABLE MainNames ; CREATE TABLE MainNames(Id SERIAL PRIMARY KEY, ServerId bigint NOT NULL, Name varchar(255) NOT NULL, OwnerId bigint NOT NULL)";
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in make_main_names');
// connection using created pool
pool.query(ceate_query,(err, result) => {
  if (err) {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);;
  }
  console.log('no error');
  console.log(result); 
});
    
}//end function

function insert_main_name(serverId, userId, name)
{   
    var check_vals = [serverId, name];
    var check_query = 'Select Id FROM MainNames WHERE ServerId = $1 AND Name = $2';
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
// connection using created pool
pool.query(check_query, check_vals,(err, result) => {
  if (err) 
  {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);
  }//end error if
  if (result.rows.count ==0)
  {
     var insert_vals = [serverId, name, userId];
     var insert_char= "INSERT INTO MainNames (ServerId, Name, OwnerId) VALUES ($1,$2,$3)";
      pool.query(insert_char, insert_vals, (err, result)=>{
          if (err) 
          {
            console.log('error occurred');
             return console.error('Error executing query', err.stack);
          }//end error if
          console.log('inserted new name');
      });//end query block
  }//end if
    
});//end query                 
}//end function
    
function get_all_infos(){
    console.log('getting all infos');
    var select_query = "SELECT * FROM MainName";
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


function convert_to_userid(guildList, input, callback)
{
    guildList.forEach(function(guildMember)
    {
        //console.log(guildMember.user);
        if (guildMember.user.username == input)
        {
            console.log(guildMember.user.id);
            callback(String(guildMember.user.id)) ; 
        }
           
        if (guildMember.user.nickname == input)
        {
            callback(String(guildMember.user.id)) ;   
        }
        
        if (guildMember.user.id == input)
        {
            callback(String(guildMember.user.id));
        }
    });//end forEach
}//end function


var Discord = require('discord.js');
var Client = new Discord.Client();
 var Momo = require('pg');




Client.on('ready', () => {
    console.log('I am ready!');

});




Client.on('message', message => {
    if (message.content.substring(0,2) === '$$') {
        convert_to_userid(message.guild.members, 'drake852456', function(result) {message.reply(result)});
        
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
            case 'add_character':
                insert_main_name(message.guild.id , message.author.id, args[1]);
                break;
                
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

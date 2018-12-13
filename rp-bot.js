function make_Names(){
    var ceate_query = "CREATE TABLE Names(id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, name varchar(255) NOT NULL, UNIQUE(server_id, name))";
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in make_main_names');
// connection using created pool
pool.query(ceate_query,(err, result) => {
  if (err) {
      //23505 means unique key constraint error 
    console.log('error occurred');
    return console.error('Error executing query', err.stack);;
  }
  console.log('no error');
  console.log(result); 
});
    
}//end function


function make_lookup(){
    var ceate_query = "CREATE TABLE Lookup(id SERIAL, server_id bigint NOT NULL, infokey varchar(255) NOT NULL, infoval text NOT NULL, UNIQUE (server_id, infokey))";
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


function get_lookup_val(server_id, key){
    console.log('getting lookup value');
    var select_query = "SELECT infoval FROM Lookup WHERE server_id = $1 AND infokey = $2";
    var query_values = [server_id, key];
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in get all info');
// connection using created pool
pool.query(select_query, query_values, (err, result) => {
  if (err) {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);;
  }
  console.log('no error');
  console.log(result.rows); 
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
    console.log('checking mainnames');
    if (err) 
    {
       console.log('error occurred');
       return console.error('Error executing query', err.stack);
    }//end error if
    if (result.rowCount ==0) //there isn't a character by that name in the server 
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
    
    else{
      console.log('ROWS GREATER THAN 0??');
      console.log(result);
    }
});//end query                 
}//end function
    
function get_all_infos(){
    console.log('getting all infos');
    var select_query = "SELECT * FROM MainNames";
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


function record_lookup(server_id, key, value, callback)
{
    console.log('in the add info function');
    var  pg  = require('pg');
    var insert_query = "INSERT INTO Lookup (server_id, infokey, infoval) VALUES($1, $2, $3)";
    var values = [server_id, key, value];
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
console.log('after pool initialization in add info');
// connection using created pool
pool.query(insert_query, values,  (err, res) => {
      //23505
    if(err.code == '23505') callback('That key is already being used')
  console.log(err, res);
  pool.end();
});
}

var Discord = require('discord.js');
var Client = new Discord.Client();
 var Momo = require('pg');



Client.on('ready', () => {
    console.log('I am ready!');

});




Client.on('message', message => {
    if (message.content.substring(0,2) === '$$') { 
        var channel = message.channel;
        var guild_id = message.guild.id
        var author_id = message.author.id
        channel.send('Testing this...');
    	var args = message.content.substring(2).split(' ');
        var command = args[0];
        switch(command){
            case 'make_em':
                //make_lookup();
                make_Names();
                break;
                
                
            case 'record_lookup':
                var info_key = args[1];
                var info_content = '';
                var i;
                for (i=2;i < args.length; i++){
                    info_content += args[i];
                }
                record_lookup(guild_id, info_key, info_content);
                break;
                
            case 'lookup':
                var info_key = args[1];
                get_lookup_val(guild_id, info_key, (msg)=>{channel.send(msg)});
                
                
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
                insert_main_name(guild_id , message.author.id , args[1]);
                break;
                
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

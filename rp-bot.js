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


function get_lookup_val(server_id, key, callback){
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
  console.log(result);
  if (err) {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);
  }
  else if (result.rows.length == 0) {
        callback('No entry found for ' + key)
    }
  else{
   callback(result.rows[0].infoval)   
  }
  console.log('no error');
  console.log(result.rows); 
});
}//end function


function get_authors_names(server_id, author_id, callback)
{
    console.log('getting authors characters');
    var select_query = "SELECT Name FROM Names WHERE server_id = $1 AND owner_id = $2";
    var query_values = [server_id, author_id];
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
// connection using created pool
pool.query(select_query, query_values, (err, result) => {
  console.log(result);
  if (err) {
    console.log('error occurred');
    return console.error('Error executing query', err.stack);
  }
  else if (result.rows.length == 0) {
        callback('No characters found')
    }
  else{
   callback(result.rows)   
  }
  console.log('no error');
  console.log(result.rows); 
});
}


function convert_to_userid(guildList, input, callback)
{
    console.log('In convert function.');
    console.log(input);
    guildList.forEach(function(guildMember)
    {
        //console.log(guildMember);
        console.log(guildMember.user);
        if (guildMember.user.username == input)
        {
            console.log('Converted username to id');
            console.log(guildMember.user.id);
            callback(String(guildMember.user.id)) ; 
        }
        console.log(guildMember.user.nickname);
        if (guildMember.user.nickname == input)
        {
            console.log('Converted nickname to id');
            console.log(guildMember.user.id);
            callback(String(guildMember.user.id)) ;   
        }
        
        if (guildMember.user.id == input)
        {
            console.log('Converted id to id');
            console.log(guildMember.user.id);
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
// connection using created pool
pool.query(insert_query, values,  (err, res) => {
      //23505
    if (err){
        if(err.code == '23505')
        {
            var error_string = 'The key ' + key + ' is already in use.'
            callback(error_string)
        }
    console.log(err, res);
    }
  pool.end();
});
}//end function


function record_name(server_id, owner_id, name, callback)
{
    console.log('in the add info function');
    var  pg  = require('pg');
    var insert_query = "INSERT INTO Lookup (server_id, owner_id, name ) VALUES($1, $2, $3)";
    var values = [server_id, owner_id, name];
    var pool = new Momo.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: true
});
// connection using created pool
pool.query(insert_query, values,  (err, res) => {
      //23505
    if (err){
        if(err.code == '23505')
        {
            var error_string = 'The name "' + name + '" is already in use.'
            callback(error_string)
        }
    console.log(err, res);
    }
  pool.end();
});
}//end function


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
                
            case 'id':
                var info_key = args[1];
                convert_to_userid(message.guild.members, info_key, (msg)=>{channel.send(msg)});
                break;
                
            case 'record_lookup':
                var info_key = args[1];
                var info_content = '';
                var i;
                for (i=2;i < args.length; i++){
                    info_content += args[i];
                }
                record_lookup(guild_id, info_key, info_content, (msg)=>{channel.send(msg)});
                break;
                
            case 'lookup':
                var info_key = args[1];
                get_lookup_val(guild_id, info_key, (msg)=>{channel.send(msg)});
                break;
                
            case 'record_name':
                var info_key = args[1];
                var name = '';
                var i;
                for (i=2;i < args.length; i++){
                    name += args[i];
                }
                
                record_name(guild_id, author_id, name, (msg)=>{channel.send(msg)});
                break;
                
            case 'get_characters':
                var author = '';
                var i;
                for (i=2;i < args.length; i++){
                    author += args[i];
                }
                convert_to_userid(message.guild.members, author, (a_id)=>{ get_authors_names(guild_id, a_id, (msg)=>{channel.send(msg)})});
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

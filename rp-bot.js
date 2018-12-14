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
    if (author_id == "None")
    {
        callback('No user by that name found'); 
        return;
    }
    console.log('getting authors characters');
    console.log(author_id);
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
   var txt = '';
   var i;
   for (i=0;i < result.rows.length; i++)
   {
        txt += result.rows[i].name;
       txt += "\n";
   }
   callback(txt)   
  }
  console.log('no error');
});
}


function convert_to_userid(guildList, input, callback)
{
    var found = false;
    guildList.forEach(function(guildMember)
    {
        if (guildMember.user.username == input)
        {
            console.log('username match')
            callback(String(guildMember.user.id)) ;
            found = true;
        }
        if (guildMember.nickname == input)
        {
             console.log('nickname match')
            callback(guildMember.user.id) ; 
            found = true;
        }
        
        if (guildMember.user.id == input)
        {
             console.log('id match')
            callback(String(guildMember.user.id));
            found = true;
        }
    });//end forEach
    
    if (found == false)
    {
        callback("None");   
    }
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
    var insert_query = "INSERT INTO Names (server_id, owner_id, name ) VALUES($1, $2, $3)";
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

function roll(high, callback,  low = 0)
{
 callback(Math.floor(Math.random() * (high+1 - low) + low))
}

var Discord = require('discord.js');
var Client = new Discord.Client();
 var Momo = require('pg');



Client.on('ready', () => {
    console.log('I am ready!');

});




Client.on('message', message => {
    if (message.content.substring(0,3) === 'rp!') { 
        var channel = message.channel;
        var guild_id = message.guild.id
        var author_id = message.author.id
        channel.send('Testing this...');
    	var args = message.content.substring(3).split(' ');
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
                
            case 'help':
                var com = args[1];
                if (com == args[1])
                {
                    var help_txt = '';
                    help_txt += "Bot comands are as follows:\n";
                    help_txt += "rp!id [username/nickname] -- Displays the id of a user \n";
                    help_txt += "rp!record [key] [Bigraphy, url, whatever text you like] -- records something to be paired with the key \n";
                    help_txt += "rp!find [key] -- Displays what was recorded with the key \n";
                    help_txt += "rp!save_character [name] -- Saves the character name supplied and associates it with the user \n";
                    help_txt += "rp!get_characters [username/nickname/id] -- Displays all characters saved by given user \n";
                    help_txt += "rp!roll [*minumum] [maximum] -- Generates number between minimum and maximum. Minimum is assumed 0 if omitted"
                 channel.send( help_txt);
                }
                
                break;
                
            case 'record':
                var info_key = args[1];
                var info_content = '';
                var i;
                for (i=2;i < args.length; i++){
                    if (i > 2) info_content += ' ';
                    info_content += args[i];
                }
                record_lookup(guild_id, info_key, info_content, (msg)=>{channel.send(msg)});
                break;
                
            case 'find':
                var info_key = args[1];
                get_lookup_val(guild_id, info_key, (msg)=>{channel.send(msg)});
                break;
                
            case 'roll':
                if (args[1] == '') break;
                var first = parseInt(args[1], 10);
                console.log(args[2])
                if (args[2] != null)
                {
                 roll(parseInt(args[2]), (msg)=>{channel.send(msg)}, first ) ;  
                }
                else{
                 roll(first, (msg)=>{channel.send(msg)})
                      }
                
                break;
                      
                 
                
            case 'save_character':
                var name = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
                record_name(guild_id, author_id, name, (msg)=>{channel.send(msg)});
                break;
                
            case 'get_characters':
                var author = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) author += ' ';
                    author += args[i];
                }
                convert_to_userid(message.guild.members, author, (a_id)=>{ get_authors_names(guild_id, a_id, (msg)=>{channel.send(msg)})});
                break;
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

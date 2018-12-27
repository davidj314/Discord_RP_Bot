//Creates table to hold character names. Does not check for table existing beforehand.
function make_Names(){
    var ceate_query = "CREATE TABLE Names(id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, name varchar(255) NOT NULL, UNIQUE(server_id, name))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log('no error');
        console.log(result); 
    });//end pool.query   
    pool.end()
}//end function

//Creates table to hold character names. Does not check for table existing beforehand.
function make_Bumps(){
    var ceate_query = "CREATE TABLE Bumps(id SERIAL, bumper_id bigint NOT NULL, bumper_name varchar(255) NOT NULL)";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log(result); 
    });//end pool.query   
    pool.end();
    //callback();//population function
}//end function

function add_bump(bumper, name){
    var insert_query = "INSERT INTO Bumps (bumper_id, bumper_name) VALUES($1, $2)";
    var values = [bumper, name];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    // connection using created pool
    pool.query(insert_query, values, (err, res) => {
        if (err){
            console.log(err, res);
        }
        pool.end();
    });    
}//end function

function populate_test_bumps(){
    var insert_query = "INSERT INTO Bumps (bumper_id, bumper_name) VALUES('9992','Drake'),('9992','Drakenwoof'),('1234','Phil')";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    // connection using created pool
    pool.query(insert_query ,  (err, res) => {
        if (err){
            console.log(err, res);
        }
        pool.end();
    });    
}//end function

function get_bump_names(callback){
    var names_query = "SELECT bumper_name, bumper_id, COUNT (bumper_name) FROM Bumps GROUP BY bumper_name, bumper_id";
    var ids_query = "SELECT bumper_id, COUNT (bumper_id) FROM Bumps GROUP BY bumper_id";
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(names_query, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            callback('No successful bumps since last call')
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            var txt = 'Successful bumps since last call:\n';
            var i = 0;
            for (i=0;i < result.rows.length; i++){
                txt += result.rows[i].count;
                txt += ' bumps - ';
                txt += result.rows[i].bumper_name;
                txt += '. ID is <' + result.rows[i].bumper_id + '>';
                txt += "\n";
            }      
            callback(txt) ;  
        }
    }); //end pool.query 
    
    pool.query(ids_query, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            callback('No successful bumps since last call');
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            var txt = 'Add-money calls:\n';
            var i = 0;
            for (i=0;i < result.rows.length; i++){
                txt += '$add-money  ';
                txt += result.rows[i].bumper_id;
                txt += " ";
                var money = 3000 * parseInt(result.rows[i].count);
                txt += money.toString() + "\n";
            }      
            callback(txt) ;  
        }
    }); //end pool.query     
    pool.end()
}//end function


function get_bumps(callback){
    var select_query = "SELECT bumper_id, COUNT (bumper_id) FROM Bumps GROUP BY bumper_id";
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            callback('No successful bumps since last call');
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            var txt = 'Add-money calls:\n';
            var i = 0;
            for (i=0;i < result.rows.length; i++){
                txt += '$add-money  ';
                txt += result.rows[i].bumper_id;
                txt += " ";
                var money = 3000 * parseInt(result.rows[i].count);
                txt += money.toString() + "\n";
            }      
            callback(txt) ;  
        }
    }); //end pool.query 
    pool.end()
}//end function



//Creates table for key-value lookups. Does not check for pre-existing table.
function make_lookup(){
    var ceate_query = "CREATE TABLE Lookup(id SERIAL, server_id bigint NOT NULL, infokey varchar(255) NOT NULL, infoval text NOT NULL, UNIQUE (server_id, infokey))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log('no error');
        console.log(result); 
    });   //end pool.query
    pool.end()
}//end function


function get_lookup_val(server_id, key, callback){
    var select_query = "SELECT infoval FROM Lookup WHERE server_id = $1 AND infokey = $2";
    var query_values = [server_id, key];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            callback('No entry found for ' + key)
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            callback(result.rows[0].infoval)   
        }
    }); //end pool.query 
    pool.end()
}//end function


//Deletes row for indicated key. This function is only accessed after checking for proper permissions beforehand
function delete_lookup_val(server_id, key){
    var select_query = "DELETE FROM Lookup WHERE server_id = $1 AND infokey = $2";
    var query_values = [server_id, key];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
    }); //end pool.query
    pool.end()
}//end function


function get_authors_names(server_id, author_id, callback)
{
    //"NoNicknameOrIDMatch" is a default value passed when there is no ID associated with the provided nickname/username
    if (author_id == "NoNicknameOrIDMatch"){
        callback('No user by that name found'); 
        return;
    }
    var select_query = "SELECT Name FROM Names WHERE server_id = $1 AND owner_id = $2";
    var query_values = [server_id, author_id];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        //no rows found indicates that the user does not have a character name associated with them
        else if (result.rows.length == 0) {
            callback('No characters found')
        }
        //rows returning means user has 1 or more character names associated with them
        //use callback function on a per-row basis
        else{
            var txt = 'Characters belonging to that person:\n';
            var i;
            for (i=0;i < result.rows.length; i++){
                txt += result.rows[i].name;
                txt += "\n";
            }
            callback(txt)   
        }
    });//end pool.query
    pool.end()
}//end function

//obtains all character names associated with particular server_id and uses callback function on a string containing all
function get_all_names(server_id, callback)
{
    var select_query = "SELECT Name FROM Names WHERE server_id = $1";
    var query_values = [server_id];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
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
            for (i=0;i < result.rows.length; i++){
                txt += result.rows[i].name;
                txt += "\n";
            }
            callback(txt);   
        }
        console.log('no error');
    });//end pool.query
    pool.end()
}//end function

//obtains all keys with associated values and uses callback function on a string containing all
function get_all_vals(server_id, callback)
{
    var select_query = "SELECT infokey FROM Lookup WHERE server_id = $1";
    var query_values = [server_id];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        else if (result.rows.length == 0) {
            callback('No records found')
        }
        else{
            var txt = 'Records retrievable with rp!find command:\n';
            var i;
            for (i=0;i < result.rows.length; i++){
                txt += result.rows[i].infokey;
                txt += "\n";
            }
            callback(txt);   
        }
        console.log('no error');
    });//end pool.query
    pool.end()
}//end function

//converts a given name or nickname into the user's id. The id is what associates the user with their associated content.
//This function is used in conjunction with any function where a user passes another user as an attribute to the bot's functions.
function convert_to_userid(guildList, input, callback)
{
    var found = false;
    guildList.forEach(function(guildMember)
    {
        if (guildMember.user.username == input)
        {
            callback(String(guildMember.user.id)) ;
            found = true;
        }
        if (guildMember.nickname == input)
        {
            callback(guildMember.user.id) ; 
            found = true;
        }
        
        if (guildMember.user.id == input)
        {
            callback(String(guildMember.user.id));
            found = true;
        }
    });//end forEach
    
    //This value indicates that there was no id associated with the provided nickname/username
    if (found == false)
    {
        callback("NoNicknameOrIDMatch");   
    }
}//end function

//this function creates a row with given key-value pair to be accessed later.
function record_lookup(server_id, key, value, callback)
{
    console.log('in the add info function');
    var insert_query = "INSERT INTO Lookup (server_id, infokey, infoval) VALUES($1, $2, $3)";
    var values = [server_id, key, value];
    var pool = new PG.Pool({
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

//Saves a provided name to be associated with user's id and server's id.
function record_name(server_id, owner_id, name, callback)
{
    console.log('in the add info function');
    var insert_query = "INSERT INTO Names (server_id, owner_id, name ) VALUES($1, $2, $3)";
    var values = [server_id, owner_id, name];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(insert_query, values,  (err, res) => {
    //23505 is unique restriction violation
    if (err){
        if(err.code == '23505'){
            var error_string = 'The name "' + name + '" is already in use.'
            callback(error_string)
        }
    console.log(err, res);
    }
  pool.end();
});
}//end function

//A simple function to generate a random whole number with the range being between min and max inclusively
//High and low are given in whichever order. If only one number is give, the range is between 0 and that number.
function roll(high, callback,  low = 0)
{
    var regex = /[\D]/g;
    var found = high.match(regex);
    if (found != null){
        callback('Invalid Input. Please use only non-negative itegers [0,1,2,...]');   
        return;
    }
    found = low.match(regex)
    if (found != null){
        callback('Invalid Input. Please use only non-negative itegers [0,1,2,...]');   
        return;
    }
    
    low_val = parseInt(low)
    high_val = parseInt(high)
    if (low_val > high_val) 
    {
        var temp = high_val;
        high_val = low_val;
        low_val = temp
    }
    callback(Math.floor(Math.random() * (high_val+1 - low_val) + low_val))
}

var Discord = require('discord.js');
var Client = new Discord.Client();
var PG = require('pg');
Client.on('ready', () => {
    console.log('I am ready!');

});

Client.on('message', message => {
    //console.log("BEFORE MESSAGE")
    /*if (message.embeds.length > 0){
            message.channel.send(message.embeds[0].description);
            message.channel.send('Doot');
        }*/
   // console.log(message.id);

    if (message.author.id == '292953664492929025'){ //pizzabot
        var regex = /(cash balance)/g;
        var found = message.embeds[0].description.match(regex);
        if (found != null){
            message.channel.send('Reg matched');  
            var prev_id = parseInt(message.id) - 1;
            //convert to string?
            message.channel.fetchMessages({ limit: 2 })
            .then(messages => {
                var m_array = messages.array();
                var i;
                var found_bump = false;
                for (i=0;i < m_array.length; i++){
                    if (m_array[i].content.match(/(cash balance)/g)){
                        found_bump = true;
                    }
                    if (found_bump){
                        console.log('id='+m_array[i].author.id)
                        i = m_array.length;
                    }
                }   
            })
            .catch(console.error);
            console.log('past the fetch');
        }
    }
    if (message.content.substring(1,4) === 'rp!') { 
        var regex = /[\D]/g;
        var channel = message.channel;
        var guild_id = message.guild.id
        var author_id = message.author.id
    	var args = message.content.substring(4).split(' ');
        var command = args[0];
        switch(command){
            case 'make_em':
                make_Bumps();
                break;
                
            case 'pop':
                populate_test_bumps();
                break;
                
            case 'bumps':
                if (message.member.hasPermission("ADMINISTRATOR") == false){
                    channel.send('Need admin permission for that command');
                }
                else{
                    get_bump_names((msg) => {message.author.send(msg)});
                    //get_bumps((msg) => {message.author.send(msg)});
                }
                break;
                
            case 'tester':
                channel.send(" !say Hop on feet");
                break;
                
            case 'id':
                if (args[1] == null) break;
                var info_key = args[1];
                convert_to_userid(message.guild.members, info_key, (msg)=>{channel.send(msg)});
                break;
                
            case 'help':
                var help_txt = '';
                help_txt += "Bot comands are as follows:\n";
                help_txt += "rp!id [username/nickname] -- Displays the id of a user \n";
                help_txt += "rp!record [key] [Bigraphy, url, whatever text you like] -- records something to be paired with the key \n";
                help_txt += "rp!find [key] -- Displays what was recorded with the key \n";
                help_txt += "rp!save_character [name] -- Saves the character name supplied and associates it with the user \n";
                help_txt += "rp!characters [username/nickname/id] -- Displays all characters saved by given user. Omit user to get all characters. \n";
                help_txt += "rp!roll [minumum] [maximum] -- Generates number between minimum and maximum. Minimum is assumed 0 if omitted"
                channel.send( help_txt);
                break;
                
            case 'record':
                if (args[1] == null) break;
                if (args[2] == null) break;
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
                if (args[1] == null){
                    get_all_vals(guild_id, (msg) => {channel.send(msg)})   
                    break
                }
                var info_key = args[1];
                get_lookup_val(guild_id, info_key, (msg)=>{channel.send(msg)});
                break;
                
            case 'roll':
                if (args[1] == null) break;
                var first = args[1];
                if (args[2] != null){
                    roll(args[2], (msg)=>{channel.send(msg)}, first ) ;  
                }
                else{
                    roll(first, (msg)=>{channel.send(msg)})
                } 
                break;
                                            
            case 'save_character':
                if (args[1] == null) break;
                var name = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
                record_name(guild_id, author_id, name, (msg)=>{channel.send(msg)});
                break;
                
            case 'characters':
                if (args[1] == null){
                    get_all_names(guild_id, (msg)=>{channel.send(msg)});
                    break;
                }
                var author = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) author += ' ';
                    author += args[i];
                }
                convert_to_userid(message.guild.members, author, (a_id)=>{ get_authors_names(guild_id, a_id, (msg)=>{channel.send(msg)})});
                break;
                
                
            case 'delete':
                if (args[1] == null)break;
                //if caller lacks Administrator permissions, don't let them delete rows
                if (message.member.hasPermission("ADMINISTRATOR") == false) channel.send('Need admin permission for that command')
                else delete_lookup_val(guild_id, args[1]);
                break;
        }
  	}
});

Client.login(process.env.BOT_TOKEN);

//----------------------------------------TABLE CREATION---------------------------------------------------

//Creates table to hold character names. Does not check for table existing beforehand.
function make_Names(){
    var create_query = "CREATE TABLE Names(id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, name varchar(255) NOT NULL, UNIQUE(server_id, name))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(create_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

function make_cards(){
	//id, server_id, owner_id, char_id, UNI (server_id, char_id) char_id is foreign key on names 
	var create_query = "CREATE TABLE Cards (id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, char_id bigint NOT NULL, url varchar(800), leftval integer, upval integer, downval integer,  rightval integer, UNIQUE(server_id, char_id))";
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
  	pool.query(create_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

function make_triggers(){
    var ceate_query = "CREATE TABLE Triggers(id SERIAL, server_id bigint NOT NULL, channel_id bigint NOT NULL, message_id bigint NOT NULL, emoji varchar (255) NOT NULL, role_snowflake bigint NOT NULL, UNIQUE(emoji, message_id))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

function drop_triggers(){
    var drop_query = "DROP TABLE Triggers";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(drop_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

//Creates table to hold character names. Does not check for table existing beforehand.
function make_Bumps(){
    var ceate_query = "CREATE TABLE Bumps(id SERIAL, server_id bigint NOT NULL, bumper_id bigint NOT NULL, bumper_name varchar(255) NOT NULL)";
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

function make_disboard_details(){
    var create_query = "CREATE TABLE Disboard_Details(id SERIAL, server_id bigint NOT NULL, command_char varchar(10) NOT NULL, reward bigint NOT NULL, UNIQUE(server_id))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(create_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log(result); 
    });//end pool.query   
    pool.end();
}

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

//----------------------------------------TABLE INSERTS---------------------------------------------------
function insert_new_trigger_message(server_id, channel_id, message_id, emoji, role, callback)
{
    var insert_query = "INSERT INTO Triggers (server_id, channel_id, message_id, emoji, role_snowflake) VALUES($1, $2, $3, $4, $5)";
    var values = [server_id, channel_id, message_id, emoji, role];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    // connection using created pool
    pool.query(insert_query, values,  (err, res) => {
        if (err){
            if(err.code == '23505')
            {
                var error_string = 'A role is already assigned to that reaction for that message.'
                callback(error_string)
            }
            console.log(err, res);
        }
        pool.end();
    });
}//end function

function delete_trigger_message(server_id, channel_id, message_id, emoji, role, callback)
{
    var insert_query = "DELETE FROM Triggers WHERE server_id = $3 AND message_id = $1 AND emoji = $2";
    var values = [message_id, emoji, server_id];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    // connection using created pool
    pool.query(insert_query, values,  (err, res) => {
        if (err){
            console.log(err, res);
        }
        pool.end();
    });
}//end function

function insert_disboard_details(server_id, command, reward){
    var insert_query = "INSERT INTO Disboard_Details(server_id, command_char, reward) VALUES ($1, $2, $3)";
    var values = [server_id, command, reward];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(insert_query, values, (err, result) => {
        if (err) {
            if(err.code == '23505'){
                var error_string = 'The key ' + key + ' is already in use.'
                callback(error_string)
            }
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log(result); 
    });//end pool.query   
    pool.end();
}

function add_bump(id, name){
    var insert_query = "INSERT INTO Bumps (bumper_id, bumper_name) VALUES($1, $2)";
    var values = [id, name];
    console.log("Adding bump with following values for id and name:");
    console.log(values);
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    // connection using created pool
    pool.query(insert_query, values, (err, res) => {
        if (err){
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
    var printout =pool.query(insert_query, values,  (err, res) => {
    //23505 is unique restriction violation
    if (err){
        if(err.code == '23505'){
            var error_string = 'The name "' + name + '" is already in use.'
            callback(error_string)
        }
    console.log(err, res);
    }
  console.log(res);
  pool.end();
});
    
    console.log(printout);
}//end function

function make_card(server_id, owner_id, char_id, url) {
//id, server_id, owner_id, char_id, UNI (server_id, char_id) char_id is foreign key on names 
    console.log("Creating card with server, owner, char, url " + server_id + " " + owner_id + " " + char_id + " " + url);	
    var insert_query = "INSERT INTO Cards (server_id, owner_id, char_id, upval, downval, leftval, rightval, url ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
    var up = 0;
    var down = 0;
    var left = 0;
    var right = 0;
    var points = 6;
    while (points > 0)
    {
	    var side = Math.floor(Math.random() * (4+1 - 1) + 1);
	    if (side == 1) up++;
	    else if (side == 2) down++;
	    else if (side == 3) left++;
	    else right++
	    points--;
    }
    var values = [server_id, owner_id, char_id, up, down, left, right, url];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    var printout =pool.query(insert_query, values,  (err, res) => {
    //23505 is unique restriction violation
    if (err){
        if(err.code == '23505'){
            var error_string = 'Card already exists for that character'
            callback(error_string)
        }
    console.log(err, res);
    }
  console.log(res);
   }); //end pool.query
  pool.end();
}

//----------------------------------------TABLE SELECTS---------------------------------------------------
function get_triggers(callback){
    var select_query = "SELECT server_id, channel_id, message_id FROM Triggers";
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            console.log('No rows returned')
            return;
        }
        //successfully found a result. Passes rows to the callback function
        else{
            callback(result.rows)   
        }
    }); //end pool.query 
    pool.end()    
}

function check_trigger(server_id, message_id, emoji, callback){
    console.log("Emoji is "+emoji);
    var select_query = "SELECT role_snowflake FROM Triggers WHERE server_id = $1 AND message_id=$2 AND emoji=$3";
    var query_values = [server_id, message_id, emoji];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            console.log('No rows returned')
            return;
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            callback(result.rows[0].role_snowflake)   
        }
    }); //end pool.query 
    pool.end()
}//end function

function get_disboard_details(server_id, write_error, build_reward){
    var select_query = "SELECT command_char, reward FROM Disboard_Details WHERE server_id = $1";
    var query_values = [server_id];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            write_error("Disboard bump rewards not set up in this server.");
            return;
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            build_reward(result.rows[0].command_char, result.rows[0].reward);
        }
    }); //end pool.query 
    pool.end()
}

function get_bump_names(server_id, callback){
    var names_query = "SELECT bumper_name, bumper_id, COUNT (bumper_name) FROM Bumps GROUP BY bumper_name, bumper_id";
    var ids_query = "SELECT bumper_id, COUNT (bumper_id) FROM Bumps GROUP BY bumper_id";
    var txt = '';
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(names_query, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicates no successful bumps were logged
        else if (result.rows.length == 0) {
            callback('No successful bumps since last call')
            return;
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            txt += 'Successful bumps since last call:\n';
            var i = 0;
            for (i=0;i < result.rows.length; i++){
                txt += result.rows[i].count;
                txt += ' bumps - ';
                txt += result.rows[i].bumper_name;
                txt += '. ID is <' + result.rows[i].bumper_id + '>';
                txt += "\n";
            }       
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
            return;
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            get_disboard_details(server_id, callback, (command, reward)=>{
                txt += 'Add-money calls:\n';
                for (var i=0;i < result.rows.length; i++){
                    txt += command;
                    txt += 'add-money  ';
                    txt += result.rows[i].bumper_id;
                    txt += " ";
                    var money = parseInt(reward) * parseInt(result.rows[i].count);
                    txt += money.toString() + "\n";
                }      
                callback(txt) ;  
                clear_bumps();
            });       
        }
    }); //end pool.query     
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
	
function get_char_id(server_id, owner_id, name, callback, bad){
    var select_query = "SELECT id FROM Names WHERE server_id = $1 AND Name = $2 AND owner_id=$3";
    var query_values = [server_id, name, owner_id];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            bad('No entry found. Check name given and ownership.')
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            callback(result.rows[0].id)   
        }
    }); //end pool.query 
    pool.end()
}//end function

function get_card_info(server_id, owner_id, name, callback, bad){
    var select_query = "SELECT url, upval, downval, leftval, rightval, FROM Cards WHERE server_id = $1 AND Name = $2 AND owner_id=$3";
    var query_values = [server_id, name, owner_id];
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, query_values, (err, result) => {
        console.log(result);
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
        //No returned rows indicate provided key is not associated with any row
        else if (result.rows.length == 0) {
            bad('No entry found. Check name given and ownership.')
        }
        //successfully found a result. Passes associated value to the callback function
        else{
            callback()   
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
            for (var i=0;i < result.rows.length; i++){
                txt += result.rows[i].infokey;
                txt += "\n";
            }
            callback(txt);   
        }
        console.log('no error');
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

//this function creates a row with given key-value pair to be accessed later.
function record_lookup(server_id, key, value, callback)
{
    var insert_query = "INSERT INTO Lookup (server_id, infokey, infoval) VALUES($1, $2, $3)";
    var values = [server_id, key, value];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
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

//----------------------------------------TABLE DELETES---------------------------------------------------
function clear_bumps(){
    console.log('Deleting stuff');
    var select_query = "DELETE FROM Bumps WHERE id > 0";
    var pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(select_query, (err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
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

//Saves a provided name to be associated with user's id and server's id.
function delete_character(server_id, owner_id, name, callback)
{
    var delete_query = "DELETE FROM Names WHERE server_id=$1 AND owner_id=$2 AND name LIKE $3";
    var values = [server_id, owner_id, name+'%'];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    pool.query(delete_query, values,  (err, res) => {
    //23505 is unique restriction violation
    if (err){
        if(err.code == '23505'){
            var error_string = 'The name "' + name + '" is already in use.'
            callback(error_string)
        }
    console.log(err, res);
    }
  console.log(res);
  pool.end();
});
}//end function

//END OF DATABASE CALLS END OF DATABASE CALLS END OF DATABASE CALLS END OF DATABASE CALLS END OF DATABASE CALLS END OF DATABASE CALLS
//----------------------------------------Discord functions---------------------------------------------------


function mine_sweep_game(callback){
    console.log('int the minesweeper function');
    var test_string = 'Testing \n';
    var x = new Array(8);
    for (var i = 0; i < x.length; i++) {
        x[i] = new Array(8);
        for (var j = 0; j < x[i].length; j++){
            x[i][j] = 0;
        }
    }
    
    for (var i = 0; i < x.length; i++) {
        for (var j = 0; j < x[i].length; j++){
            var num = Math.floor(Math.random() * (5));
            if (num==0){ //set this cell to bomb then increment bomb counts for adjacent cells
                x[i][j] = -20;//will stay negative regardless of adjacent bombs
                var not_left = (j > 0); //bomb isn't on the left edge
                var not_right = (j < x[i].length-1); //bomb isn't on the right edge
                var not_top = (i > 0); //bomb isn't on the top row
                var not_bottom = (i < x.length-1); //bomb isn't on the bottom row
                if(not_left){
                    if (not_top){
                        x[i-1][j-1]+=1;
                    }
                    if(not_bottom){
                        x[i+1][j-1]+=1;
                    }
                    x[i][j-1]+=1;
                }
                if(not_right){
                    if (not_top){
                        x[i-1][j+1]+=1;
                    }
                    if(not_bottom){
                        x[i+1][j+1]+=1;
                    }
                    x[i][j+1]+=1;
                }
                if(not_top){
                    x[i-1][j]+=1;
                }
                if(not_bottom){
                    x[i+1][j]+=1;
                }
            }//end of incrementing adjacent
        }//end of per cell
    }//end of per row
    
    var return_string = "";
    for (var i = 0; i < x.length; i++){
        for(var j = 0; j < x[i].length; j++){
            var cell = x[i][j];
            if(cell <0){
                return_string+= '||:bomb:||'
            }
            else if(cell ==0){
                return_string+= '||:white_medium_square:||'
            }
            else if(cell ==1){
                return_string+= '||:one:||'
            }
            else if(cell ==2){
                return_string+= '||:two:||'
            }
            else if(cell ==3){
                return_string+= '||:three:||'
            }
            else if(cell ==4){
                return_string+= '||:four:||'
            }
            else if(cell ==5){
                return_string+= '||:five:||'
            }
            else if(cell ==6){
                return_string+= '||:six:||'
            }
            else if(cell ==7){
                return_string+= '||:seven:||'
            }
            else{
                return_string+= '||:eight:||'
            }
        }
        return_string +='\n'
    }
    callback(return_string);
}//end of function

//converts a given name or nickname into the user's id. The id is what associates the user with their associated content.
//This function is used in conjunction with any function where a user passes another user as an attribute to the bot's functions.
function convert_to_userid(guildList, input, callback)
{
    var found = false;
    guildList.forEach((guildMember)=>
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

//This function takes a message and checks to see if it is disboard confirming a bump
//If a bump is confirmed it will check the preceeding messages to find the bumper
function disboard_check(message){
    if (message.author.id == '302050872383242240'){ //Disboard Bot
        if (message.embeds.length == 0)return; //not a bump confirmation. Return
        var regex = /(Bump done)/g;
        var found = message.embeds[0].description.match(regex);
        if (found != null){ //found not being null means there was bump confirmation
            message.channel.fetchMessages({ limit: 9 })
            .then(messages => {
                var m_array = messages.array(); //m_array will hold the most recent messages, including the bump confirmation and bump command
                var found_bump = false;
                for (var i=0;i < m_array.length; i++){
                    if (found_bump){
                        if (!m_array[i].content.match(/^!disboard +(B|b)(U|u)(M|m)(P|p).*/)) continue; //continue looking if message isn't the bump command
                        add_bump(m_array[i].author.id, m_array[i].author.username); //log the user as having a successful bump
                        i = m_array.length; //terminate loop
                    }
                    else if (m_array[i].embeds.length > 0 && m_array[i].embeds[0].description.match(/(Bump done)/g)){
                        found_bump = true;
                    }   
                }   
            })
            .catch(console.error);
        }
    }    
}

async function show_card(url, up, down, left, right, callback)
{
	console.log("trying to show a card");
	console.log(`Top ${up}, Bottom ${down}, Left ${left}, Right ${right}, URL ${url}` );
const canvas = Canvas.createCanvas(150, 150);
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	
	const bck1 = await Canvas.loadImage('https://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/blue0517.jpg?itok=V3825voJ');
	const character = await Canvas.loadImage(url);
	console.log("the url is "+url);
	// Select the font size and type from one of the natively available fonts
	ctx.font = '20px sans-serif';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1; 
		
	//top left	
	ctx.drawImage(bck1, 0, 0, 96, 120);
	ctx.drawImage(character, 2, 2, 92, 116);
	ctx.strokeText(`  ${up} \n${left}  ${right}\n  ${down}`, 3, 15);
	ctx.fillText(`  ${up} \n${left}  ${right}\n  ${down}`, 3, 15);
	
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
	console.log("Should be sending message")
	callback(`Card`, attachment);	
	
}

function convert_role_to_snowflake(server, role, callback, printerror){
    var role_array = server.roles.array();
    var snowflake = -1;
    console.log("searching for " + role);
    for (var i = 0; i < role_array.length; i++){
        console.log(role_array[i].name);
        if (role_array[i].name == role){
            snowflake = role_array[i].id;
            break;
        }
    }
    
    if (snowflake==-1){
        printerror();
    }
    else{
        callback(snowflake);
    }
}

var Discord = require('discord.js');
var Client = new Discord.Client();
const Canvas = require('canvas');
var PG = require('pg');
Client.on('ready', () => {
    console.log('I am ready!');
    //BECAUSE messageReactions ONLY FIRES ON CACHED MESSAGES, WE NEED TO CACHE ALL MESSAGES WE USE FOR REACTIONS
    get_triggers((rows)=>{        
        rows.forEach((row)=>{//each returned row is a message to be cached
            try{
            var channel = Client.guilds.get(row.server_id).channels.get(row.channel_id);
            channel.fetchMessage(row.message_id).then(message=>{}).catch(console.error);
            
            console.log("Guild: ",row.server_id," Channel: ", row.channel_id, " Message: ", row.message_id);
            }
            catch{
                ;   
            }
        })   
    })
});

Client.on('messageReactionAdd', (messageReaction, user)  => {
    var message_id = messageReaction.message.id;
    var server = messageReaction.message.guild;
    check_trigger(server.id, message_id, messageReaction.emoji.name, (role)=>{
        if (role == null){
            console.log("no role given");
            return;
        }
        server.fetchMember(user).then(fetched=>{fetched.addRole(server.roles.get(role))}); //fetches the user who reacted and adds the appropriate role
    });
});

Client.on('messageReactionRemove', (messageReaction, user)  => {
    var message_id = messageReaction.message.id;
    var server = messageReaction.message.guild;
    check_trigger(server.id, message_id, messageReaction.emoji.name, (role)=>{
        if (role == null){
            console.log("no role removed");
            return;
        }
        server.fetchMember(user).then(fetched=>{fetched.removeRole(server.roles.get(role))}); //fetches the user who reacted and adds the appropriate role
    });
});


Client.on('message',  async message => {
    disboard_check(message);
    
	if(message.content=="text"){
	const canvas = Canvas.createCanvas(396, 418);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('http://www.finalfantasykingdom.net/8/TTBOARD.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	
	const bck1 = await Canvas.loadImage('https://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/blue0517.jpg?itok=V3825voJ');
	const bck2 = await Canvas.loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1ScbytNAjJFFGQRhGm-Me3ad-SJZbyzYm3A2FpU4MDsaao6D-');
		
	const avatar = await Canvas.loadImage('https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Squall_Leonhart.png/220px-Squall_Leonhart.png');
	const bigsandor = await Canvas.loadImage('https://media.discordapp.net/attachments/560467474340904960/583611438929674261/dab.png');
	const woofer = await Canvas.loadImage('https://media.discordapp.net/attachments/560467474340904960/582295261171286017/kisspng-dungeons-dragons-pathfinder-roleplaying-game-d20-5b29f51124a3e3.png?width=552&height=613');
	// Move the image downwards vertically and constrain its height to 200, so it's a square
	
	const left = 53;
	const top = 24;
	const wo = 98;
	const ho = 122;
	// Select the font size and type from one of the natively available fonts
	ctx.font = '20px sans-serif';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1; 
		
	//top left	
	/*ctx.drawImage(bck1, 54, 25, 96, 120);
	ctx.drawImage(bigsandor, 56, 27, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 57, 40);
	ctx.fillText("  4 \n4  4\n  4", 57, 40);*/
		
	//top middle	
	ctx.drawImage(bck2, 152, 25, 96, 120);
	ctx.drawImage(bigsandor, 154, 27, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 155, 40);
	ctx.fillText("  4 \n4  4\n  4", 155, 40);
		
	//top right	
	ctx.drawImage(bck1, 250, 25, 96, 120);
	ctx.drawImage(bigsandor, 252, 27, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 253, 40);
	ctx.fillText("  4 \n4  4\n  4", 253, 40);
		
	//------------------
	//top left	
	ctx.drawImage(bck2, 54, 147, 96, 120);
	ctx.drawImage(bigsandor, 56, 149, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 57, 162);
	ctx.fillText("  4 \n4  4\n  4", 57, 162);
		
	//top middle	
	ctx.drawImage(bck1, 152, 147, 96, 120);
	ctx.drawImage(bigsandor, 154, 149, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 155, 162);
	ctx.fillText("  4 \n4  4\n  4", 155, 162);
		
	//top right	
	/*ctx.drawImage(bck2, 250, 147, 96, 120);
	ctx.drawImage(bigsandor, 252, 149, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 253, 162);
	ctx.fillText("  4 \n4  4\n  4", 253, 162);*/
		
	//----------------------
		
	//top left	
	/*ctx.drawImage(bck1, 54, 269, 96, 120);
	ctx.drawImage(bigsandor, 56, 271, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 57, 284);
	ctx.fillText("  4 \n4  4\n  4", 57, 284);
		
	//top middle	
	ctx.drawImage(bck2, 152, 269, 96, 120);
	ctx.drawImage(bigsandor, 154, 271, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 155, 284);
	ctx.fillText("  4 \n4  4\n  4", 155, 284);*/
		
	//top right	
	ctx.drawImage(bck1, 250, 269, 96, 120);
	ctx.drawImage(bigsandor, 252, 271, 92, 116);
	ctx.strokeText("  4 \n4  4\n  4", 253, 284);
	ctx.fillText("  4 \n4  4\n  4", 253, 284);
	
		
		
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
	message.channel.send(`Testing a thing`, attachment);

    
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    
    
    
    
    
    
    
    if (message.content.substring(0,3) === 'rp!') { 
        console.log(message.content);
        var channel = message.channel;
        var guild_id = message.guild.id
        var author_id = message.author.id
    	var args = message.content.substring(3).split(' ');
        var command = args[0];
        switch(command){
                
            case 'drop_em':
                //drop_triggers();
                break;
                
            case 'make_em':
                make_cards();
                break;
                
            case 'minesweeper':
                mine_sweep_game((msg)=>{channel.send(msg)});
                break;
                
            case 'minecode':
                mine_sweep_game((msg)=>{channel.send("`"+msg+"`")});
                break;
                
            case 'trigger':
                if (message.member.hasPermission("ADMINISTRATOR") == false && author_id != "269338190547124235"){
                    channel.send('Need admin permission for that command')
                    break;
                }
                if(args.length < 4)break;
                var message_id = args[1];
                var trigger = args[2];
                var role = "";
                for (var i = 3; i < args.length; i++){
                    role += args[i];
                    if (i != args.length-1) role += " ";
                }
                //insert_new_trigger_message(server_id, channel_id, message_id, emoji, role, callback)
                convert_role_to_snowflake(message.guild, role, (snowflake)=>{ 
                    insert_new_trigger_message(guild_id, channel.id, message_id, trigger, snowflake, (msg)=>{
                        channel.send(msg)
                    })
                }, ()=>{channel.send("Failed to make trigger")});
                channel.fetchMessage(message_id).then(msg=>{msg.react(trigger)}).catch(console.error);
                break;
                
            case 'dtrigger':
                if (message.member.hasPermission("ADMINISTRATOR") == false && author_id != "269338190547124235"){
                    channel.send('Need admin permission for that command')
                    break;
                }
                if(args.length < 4)break;
                var message_id = args[1];
                var trigger = args[2];
                var role = "";
                for (var i = 3; i < args.length; i++){
                    role += args[i];
                    if (i != args.length-1) role += " ";
                }
                //insert_new_trigger_message(server_id, channel_id, message_id, emoji, role, callback)
                convert_role_to_snowflake(message.guild, role, (snowflake)=>{ 
                    delete_trigger_message(guild_id, channel.id, message_id, trigger, snowflake, (msg)=>{
                        channel.send(msg)
                    })
                }, ()=>{channel.send("Failed to make trigger")});
                message.react(trigger);
                break;
                
            case 'bump_details':
                if (args.length != 3)break;
                if (message.member.hasPermission("ADMINISTRATOR") == false){
                    channel.send('Need admin permission for that command')
                    break;
                }
                var prefix = args[1];
                var amount = args[2];
                insert_disboard_details(guild_id, prefix, amount);
                break;
                
            case 'bumps':
                if (message.member.hasPermission("ADMINISTRATOR") == false){
                    channel.send('Need admin permission for that command');
                }
                else{
                    get_bump_names(guild_id, (msg) => {message.author.send(msg)});
                }
                break;
                
            case 'id':
                if (args[1] == null) break;
                var info_key = args[1];
                convert_to_userid(message.guild.members, info_key,  (msg)=>{channel.send(msg)});
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
                if (args.length < 3) break;
                var info_key = args[1];
                var info_content = '';
                //build value from all of remaining message
                for (var i=2;i < args.length; i++){
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
                for (var i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
                record_name(guild_id, author_id, name, (msg)=>{channel.send(msg)});
                break;
                
            case 'delete_character':
                if (args[1] == null) break;
                var name = '';
                for (var i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
                delete_character(guild_id, author_id, name, (msg)=>{channel.send(msg)});
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
			
	    case 'make_card':
		if (args[1] == null)break;
		var name = '';
		for (i=1;i < args.length-1; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
		var url = args[args.length-1];
		//make_card(server_id, owner_id, char_id, url)
		get_char_id(guild_id, author_id, name, (cid)=>{make_card(guild_id, author_id, cid, url) ;}, (msg)=>{channel.send(msg)} ) ;	
		
		break;
	
	    case 'see_card':
		if (args[1] == null)break;
		var name = '';
		for (i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
		//show_card(url, up, down, left, right, callback)
		//get_card_info(server_id, owner_id, name, callback, bad)
		get_card_info(guild_id, author_id, name, (row)=>{show_card(row.url, row.upval, row.downval, row.leftval, row.rightval) ;}, (msg)=>{channel.send(msg)} ) ;	
		
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

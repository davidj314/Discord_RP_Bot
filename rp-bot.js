var Discord = require('discord.js');
var Tester = require('Cardm');
var Client = new Discord.Client();
var DB = require('db6');
const Canvas = require('canvas');
var PG = require('pg');
var board = [];
var hands = [];
	
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
	var create_query = "CREATE TABLE Cards (id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, char_id bigint NOT NULL, url varchar(800), leftval integer, upval integer, downval integer,  rightval integer, xp bigint NOT NULL, name varchar(255) NOT NULL, UNIQUE(server_id, char_id))";
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
  	pool.query(create_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);
        }
    });//end pool.query   
    pool.end()
}//end function

function drop_cards(){
	var drop_query = "DROP TABLE Cards"	;
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
	pool.query(drop_query,(err, result) => {
		if (err){
			console.log('error occured dropping Cards');
			return console.error('Error executing query', err.stack);
		}
	});
	pool.end();
}

function drop_train(){
	var drop_query = "DROP TABLE Trainings"	;
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
	pool.query(drop_query,(err, result) => {
		if (err){
			console.log('error occured dropping Cards');
			return console.error('Error executing query', err.stack);
		}
	});
	pool.end();
}

function make_card_inv(){
	var create_query = "CREATE TABLE Card_Inv (id SERIAL, server_id bigint NOT NULL, owner_id bigint NOT NULL, cid bigint NOT NULL)";
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
  	pool.query(create_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

function drop_card_inv(){
	var drop_query = "DROP TABLE Card_Inv"	;
	var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
	pool.query(drop_query,(err, result) => {
		if (err){
			console.log('error occured dropping Card_inv');
			return console.error('Error executing query', err.stack);
		}
	});
	pool.end();
}



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

function make_trainings(){
    var ceate_query = "CREATE TABLE Trainings(id SERIAL, server_id bigint NOT NULL, user_id bigint NOT NULL, set_char bigint, UNIQUE (server_id, user_id ))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log('no error making trainings table');
    });   //end pool.query
    pool.end()
}//end function

function make_packs(){
    var ceate_query = "CREATE TABLE Packs(id SERIAL, server_id bigint NOT NULL, user_id bigint NOT NULL, Packs bigint, UNIQUE (server_id, user_id ))";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(ceate_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
        console.log('no error making packs');
    });   //end pool.query
    pool.end()
}//end function

function drop_packs(){
    var drop_query = "DROP TABLE Packs";
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL,SSL: true});
    pool.query(drop_query,(err, result) => {
        if (err) {
            console.log('error occurred');
            return console.error('Error executing query', err.stack);;
        }
    });//end pool.query   
    pool.end()
}//end function

//----------------------------------------TABLE INSERTS---------------------------------------------------



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


function make_card(server_id, owner_id, char_id, url, name, callback) {
//id, server_id, owner_id, char_id, UNI (server_id, char_id) char_id is foreign key on names 
    console.log("Creating card with server, owner, char, url " + server_id + " " + owner_id + " " + char_id + " " + url);	
    var insert_query = "INSERT INTO Cards (server_id, owner_id, char_id, upval, downval, leftval, rightval, url, xp, name ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
    var up = 0;
    var down = 0;
    var left = 0;
    var right = 0;
    var points = 7;
    while (points > 0)
    {
	    var side = Math.floor(Math.random() * (4+1 - 1) + 1);
	    if (side == 1) up++;
	    else if (side == 2) down++;
	    else if (side == 3) left++;
	    else right++
	    points--;
    }
	//server_id, owner_id, char_id, upval, downval, leftval, rightval, url, name, xp 
    var values = [server_id, owner_id, char_id, up, down, left, right, url, 0, name];
    var newid = -1;
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
    else{
	    newid=char_id;
	    if (newid != -1 )add_card_to_inv(server_id, owner_id, newid);
    }
   }); //end pool.query
  pool.end();
}

function add_card_to_inv(server_id, owner_id, cid) {
//id, server_id, owner_id, char_id, UNI (server_id, char_id) char_id is foreign key on names 
    console.log(`Card to inventory. Player is ${owner_id}, card is ${cid}`);	
    var insert_query = "INSERT INTO Card_Inv (server_id, owner_id, cid ) VALUES($1, $2, $3)";
    var values = [server_id, owner_id, cid];
    var pool = new PG.Pool({connectionString: process.env.DATABASE_URL, SSL: true});
    var printout =pool.query(insert_query, values,  (err, res) => {
    //23505 is unique restriction violation
    if (err){
    console.log(err, res);
    }
   }); //end pool.query
  pool.end();
}

//----------------------------------------TABLE SELECTS---------------------------------------------------


//----------------------------------------TABLE DELETES---------------------------------------------------

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


Client.on('ready', () => {
    console.log('I am ready!');
    //BECAUSE messageReactions ONLY FIRES ON CACHED MESSAGES, WE NEED TO CACHE ALL MESSAGES WE USE FOR REACTIONS
    DB.get_triggers((rows)=>{        
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
    DB.check_trigger(server.id, message_id, messageReaction.emoji.name, (role)=>{
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
    DB.check_trigger(server.id, message_id, messageReaction.emoji.name, (role)=>{
        if (role == null){
            console.log("no role removed");
            return;
        }
        server.fetchMember(user).then(fetched=>{fetched.removeRole(server.roles.get(role))}); //fetches the user who reacted and adds the appropriate role
    });
});

Client.on('message',  async message => {
	//lvl_card(server_id, direction, char_id)
	DB.get_training(message.guild.id, message.author.id, (char_id)=>{  
		DB.get_card_info(message.guild.id, char_id, (card)=>{
			Tester.handle_card_xp(card, message, 
				       (val)=>{DB.lvl_card(message.guild.id, val, char_id)}, 
				       (num)=>{DB.set_xp(message.guild.id, num, char_id)}
			)
		}, 
		(msg)=>{;})});//end get_training
	
	
    
    if (message.content.substring(0,3) === 'rp!') { 
        console.log(message.content);
        var channel = message.channel;
        var guild_id = message.guild.id
        var author_id = message.author.id
    	var args = message.content.substring(3).split(/\s+/);
        var command = args[0];
        switch(command){
                
	case 'drop_em':
                drop_cards();
		drop_card_inv();
		drop_train();
		drop_packs();
                break;
                
	case 'make_em':
		make_cards();
		make_card_inv();
                make_trainings();
		make_packs();
                break;			

	case 'add_pack':
		if (message.member.hasPermission("BAN_MEMBERS") == false) channel.send("You lack permissions for this command.");
		else{
			var other_id = message.mentions.users.first().id;
			DB.insert_new_pack_count(guild_id, other_id);	
		}
		break;
			
	case 'set_training':
		if (args.length != 2)break;
		var cid = args[1];
		if (isNaN(cid)) {
    			channel.send('This is not number');
			break;
		}
		DB.insert_user_set_char(guild_id, author_id, cid, (msg)=>{channel.send(msg);});
		break;	
		
	case 'starter_packs':
		DB.starter_pack(guild_id, author_id);
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
                    DB.insert_new_trigger_message(guild_id, channel.id, message_id, trigger, snowflake, (msg)=>{
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
                }, ()=>{channel.send("Failed to destroy trigger")});
                message.react(trigger);
                break;
                
	case 'id':
		if (args[1] == null) break;
		var info_key = args[1];
		convert_to_userid(message.guild.members, info_key,  (msg)=>{channel.send(msg)});
		break;
                
	case 'help':
                Tester.help((msg)=>{channel.send(msg)})
                break;
			
	case 'tri_rules':
		Tester.tri_rules((msg)=>{channel.send(msg)});
		break;
			
	case 'tri_help':
		Tester.tri_help((msg)=>{channel.send(msg)})
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
                DB.record_lookup(guild_id, info_key, info_content, (msg)=>{channel.send(msg)});
                break;
                
            case 'find':
                if (args[1] == null){
                    DB.get_all_vals(guild_id, (msg) => {channel.send(msg)})   
                    break
                }
                var info_key = args[1];
                DB.get_lookup_val(guild_id, info_key, (msg)=>{channel.send(msg)});
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
		if (message.content.indexOf("http") !=-1){channel.send("No Links please."); break;}
		if (args.length > 10) {channel.send("Names only, please."); break;}
                var name = '';
                for (var i=1;i < args.length; i++){
                    if (i > 1) name += ' ';
                    name += args[i];
                }
                DB.record_name(guild_id, author_id, name, (msg)=>{channel.send(msg)});
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
                    DB.get_all_names(guild_id, (msg)=>{channel.send(msg)});
                    break;
                }
                var author = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) author += ' ';
                    author += args[i];
                }
                convert_to_userid(message.guild.members, author, (a_id)=>{ DB.get_authors_names(guild_id, a_id, (msg)=>
											     {
			for(var i = 0; i < msg.length; i+=1800) channel.send(msg.slice(i, i+1800))
		})});
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
		//get_char_id(server_id, owner_id, name, callback, bad)
		DB.get_char_id(guild_id, author_id, name, (cid)=>{DB.make_card(guild_id, author_id, cid, url, name,(msg)=>{channel.send(msg);} ) ;}, (msg)=>{channel.send(msg)} ) ;	
		
		break;
	
	    case 'see_card':
		if (args[1] == null)break;
		var cid = args[1];
		DB.get_card_info(
			guild_id,  
			cid, 
			(row)=>{Tester.show_card(
				row.url, 
				row.upval, 
				row.downval, 
				row.leftval, 
				row.rightval, 
				(msg, att)=>{channel.send(msg, att)}
			)},
			(msg)=>{channel.send(msg)}) ;
		break;
		
	    case 'cards':
		//get_user_cards(server_id, owner_id, callback, bad)
		DB.get_user_cards(guild_id, author_id, (rows)=>{
			var output = "CID         Total               Up               Left          Right           Down               Name   \n";
			var allcards = []
			rows.forEach(function(row){ allcards.push({cid: row.cid, up: row.upval, down: row.downval, left: row.leftval, right: row.rightval, name: row.name, total: row.upval+row.downval+row.leftval+row.rightval})});
			
			for(var i = 0; i < allcards.length; i++){
				if (cid/10 < 1) output += '0';
				if (cid/100<1) output += '0';
				output += allcards[i].cid;
				var bigbuff = "                                            ";
				var lilbuff = bigbuff.slice(0,19);
				output += "                      "
				output += allcards[i].total;
				output += lilbuff;
				output += allcards[i].up;
				output += lilbuff;
				output += allcards[i].left;
				output += lilbuff;
				output += allcards[i].right;
				output += lilbuff;
				output += allcards[i].down;
				output += lilbuff;
				output += allcards[i].name;
				output += '\n';
				if(output.length > 1700){
					channel.send(output);
					output="";
				}
			}
			
			if (output.length > 0) channel.send(output);
			
			}, (msg)=>{channel.send(msg);});
		break;
			
	    case 'all_cards':
		//get_user_cards(server_id, owner_id, callback, bad)
		DB.get_all_cards(guild_id, (rows)=>{
			var output = "CID         Total               Up               Left          Right           Down               Name   \n";
			var allcards = []
			rows.forEach(function(row){ allcards.push({cid: row.char_id, up: row.upval, down: row.downval, left: row.leftval, right: row.rightval, name: row.name, total: row.upval+row.downval+row.leftval+row.rightval})});
			for(var i = 0; i < allcards.length; i++){
				output += allcards[i].cid;
				var bigbuff = "                                        ";
				var lilbuff = bigbuff.slice(0,19);
				output += "                 "
				output += allcards[i].total;
				output += lilbuff;
				output += allcards[i].up;
				output += lilbuff;
				output += allcards[i].left;
				output += lilbuff;
				output += allcards[i].right;
				output += lilbuff;
				output += allcards[i].down;
				output += lilbuff;
				output += allcards[i].name;
				output += '\n';
			}
			channel.send(output);
			}, (msg)=>{channel.send(msg);});
		break;
			
		case 'open_cards':
			
		DB.pop_pack(guild_id, author_id,()=> {DB.get_all_cards(guild_id, (rows)=>{
			var cids = []
			rows.forEach(
				function(row){ 
					cids.push(row.char_id)
					console.log(`pushing cid: ${row.char_id}`);
				});//end foreach
			var card_id = Math.floor(Math.random() * cids.length);
			DB.add_card_to_inv(guild_id, author_id, cids[card_id]);
			DB.get_card_info(
				guild_id,  
				cids[card_id], 
				(row)=>{
					channel.send(`You obtained: ${row.name}`);
					Tester.show_card(
						row.url, 
						row.upval, 
						row.downval, 
						row.leftval, 
						row.rightval, 
						(msg, att)=>{channel.send(msg, att)}
					)
				},
				(msg)=>{channel.send(msg)});//end get card info
			
			
			
			})}//end get all cards 
			  , (msg)=>{channel.send(msg)}
			 );
		
		break;
			
	    case 'made_cards':
		//get_user_cards(server_id, owner_id, callback, bad)
		DB.get_user_made_cards(guild_id, author_id, (rows)=>{
			print_made_cards(rows, (msg)=>{channel.send(msg);})
			}, (msg)=>{channel.send(msg);});
		break;
			
			
	    case 'say':
		var phrase = '';
                var i;
                for (i=1;i < args.length; i++){
                    if (i > 1) phrase += ' ';
                    phrase += args[i];
                }	
		message.channel.send(phrase);
		break;
                          
            case 'delete':
                if (args[1] == null)break;
                //if caller lacks Administrator permissions, don't let them delete rows
                if (message.member.hasPermission("ADMINISTRATOR") == false) channel.send('Need admin permission for that command')
                else delete_lookup_val(guild_id, args[1]);
                break;
			
	    case 'game':
		if (args[1] == null)break;
		var p1id = author_id.toString();
		var p2id = message.mentions.users.first().id.toString();
		var p1nick = message.author.username;
		var p2nick = message.mentions.users.first().username;
		var terminate = 0;
		board.forEach(function(B){
			if (B.initiator==p1id && B.server==guild_id){
				channel.send('You are already in a game. rp!end_game to end it.');
				terminate=1;
			}
			if(B.challenged ==p2id && B.server==guild_id){
				channel.send('They are already in a game. They can use rp!end_game to end it.');
				terminate=1
			}
		});
		if (terminate)return;
		var key = guild_id+ p1id;
		var newboard = {lock: key, plays: 0, server: guild_id, turn: p2id, initiator:p1id, challenged:p2id, initiator_nick: p1nick, challenged_nick: p2nick,  positions: [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]   ]};
		board.push(newboard);
		
		//get_user_cards(guild_id, author_id, (rows)
		await DB.get_user_cards(guild_id, author_id, async (rows)=>{
			if (rows.length < 5)
			{
				channel.send('You lack the required amount of cards');
				kill_game(author_id, guild_id);
				return;
			}
			var hand = [];
			var hand_cards = [];
			while (hand_cards.length < 5)
			{
				var pull1 = Math.floor(Math.random() * (rows.length));
				hand_cards.push({used: 0, color: "Blue", up: rows[pull1].upval, down: rows[pull1].downval, left: rows[pull1].leftval, right: rows[pull1].rightval, url: rows[pull1].url});
				rows.splice(pull1,1);
			}

			hands.push({id: p1id, board: key, server:guild_id, hand:hand_cards});
			
			}, (msg)=>{channel.send(msg)});
			
		await DB.get_user_cards(guild_id, p2id, async (rows)=>{
			if (rows.length < 5){
				channel.send('That Player lacks the required amount of cards');
				kill_game(author_id, guild_id);
				return;
			}
			var hand_cards = [];
			while (hand_cards.length < 5){
				console.log(`Row num is ${rows.length}, Hand count is ${hand_cards.length}`);
				var pull1 = Math.floor(Math.random() * (rows.length));
				console.log(rows[pull1]);
				hand_cards.push({used: 0, color: "Red", up: rows[pull1].upval, down: rows[pull1].downval, left: rows[pull1].leftval, right: rows[pull1].rightval, url: rows[pull1].url});
				rows.splice(pull1,1);
			}

			hands.push({id: p2id, board: key, server:guild_id, hand:hand_cards});
			
			await  Tester.show_board(newboard.positions, (msg, att)=>{channel.send(msg, att)});
			for (var i = 0; i < hands.length;i++){
				if (hands[i].id == author_id && hands[i].server == guild_id && hands[i].board==key){
					await Tester.show_hand(hands[i].hand, p1nick,  (msg, att)=>{channel.send(msg, att)});
					break;
				}
			}
			for (var i = 0; i < hands.length;i++){
				if (hands[i].id == p2id && hands[i].server == guild_id && hands[i].board==key){
					await Tester.show_hand(hands[i].hand, p2nick, async (msg, att)=>{
						await message.channel.send(msg, att);
						await message.channel.send(`The challenged, ${newboard.challenged_nick}, goes first`);
						var hand_index = -1;
						var auto = -1
						if (newboard.turn=="514084613732433921"){
							for (var i = 0; i < hands.length; i++){
								if (hands[i].id == "514084613732433921")hand_index=i;
							}
							auto = 1;
					
						}
						if (auto==1) await auto_turn(newboard.positions, hands[hand_index].hand, (msg)=>{message.channel.send(msg)});
					});//end Tester.show_hand
					break;//break from for loop
				}//end if 
			}//end for 
			
		}, (msg)=>{channel.send('Other player might lack cards'); kill_game(p2id, guild_id);});	
			
		break;
			
		case 'triplace':
			console.log("in triplace");
			if (args[1] == null)break;
			if (args[2] == null)break;
			var card_index =  parseInt(args[1]);
			var boardnum = parseInt(args[2]);
			var pointer = -1;
			for (var i = 0; i < hands.length; i++){
				if (hands[i].id == author_id && hands[i].server==guild_id){
					pointer = i;
					break;
				}
			}
			if (pointer == -1){
				channel.send("Your aren't in a game");
				return;
			}
			if (boardnum > 9 || boardnum < 0){
				channel.send("Board positions are 1 through 9. \n1 2 3\n4 5 6\n7 8 9");
				break;
			}
			if (card_index > 5 || boardnum < 0){
				channel.send("Card positions are 1 through 5. \n1 2 3\n4 5 6\n7 8 9");
				break;
			}
			if (hands[pointer].hand[card_index-1].used == 1){
				channel.send("That card has already been used. Select another.");
				break;
			}

			var d1 = ((boardnum-1)/3);
			var d2 = ((boardnum-1)%3);
			
			d1 -= d1%1;
			d2 -= d2%1;
			
			var card = hands[pointer].hand[card_index-1];
			var boardid = hands[pointer].board;
			var temp = 0;
			var found = 0;
			while(temp < board.length){
				if (board[temp].lock == boardid){
					if(board[temp].turn!= author_id){
						message.channel.send("It is not your turn.")
						return;
					}
					if(board[temp].positions[d1][d2] != -1){
						message.channel.send("There's already a card there")
						return;
					}
					board[temp].positions[d1][d2] = card;
					board[temp].plays++;
					hands[pointer].hand[card_index-1].used = 1;
					found++;
				}
				temp++;
				if(found==1)break;
			}
			temp--;
			
			//turn: p2id, initiator:p1id, challenged:p2id,
			if (author_id==board[temp].initiator) board[temp].turn = board[temp].challenged;
			else board[temp].turn = board[temp].initiator;
			//card, row, col, positions
			await Tester.resolve_fights(hands[pointer].hand[card_index-1], d1, d2, board[temp].positions, (msg)=>{channel.send(msg);}, (msg, att)=>{channel.send(msg, att)});
			
			await  Tester.show_board(board[temp].positions, (msg, att)=>{message.channel.send(msg, att)});
			//async function show_hand(hand, callback)
			
			//initiator
			for (var i = 0; i < hands.length; i++){
				if (hands[i].id == board[temp].initiator && hands[i].server == guild_id && hands[i].board==board[temp].lock){
					pointer = i;
					break;
				}
			}
			
			if (board[temp].plays < 9)
			{
				await Tester.show_hand(hands[pointer].hand, board[temp].initiator_nick, (msg, att)=>{message.channel.send(msg, att)});
				console.log("after first tester.show_hand")
				for (var i = 0; i < hands.length; i++){
					if (hands[i].id == board[temp].challenged && hands[i].server == guild_id && hands[i].board==board[temp].lock){
						pointer = i;
						break;
					}
				}
				await Tester.show_hand(hands[pointer].hand, board[temp].challenged_nick, async (msg, att)=>{
					await message.channel.send(msg, att);
					var hand_index = -1;
					var auto = -1
					if (board[temp].turn=="514084613732433921"){
						for (var i = 0; i < hands.length; i++){
							if (hands[i].id == "514084613732433921")hand_index=i;
						}
						auto = 1;
					
					}
				
					if (auto==1) await auto_turn(board[temp].positions, hands[hand_index].hand, (msg)=>{message.channel.send(msg)});
				});
				
			
			}
			else
			{
				await Tester.finish_game(board[temp], (msg, att)=>{message.channel.send(msg, att)});
				var boardid = board[temp].lock;
				//erase hands from the game
				for (var i = 0; i < hands.length; i++)
				{
					if (hands[i].board == boardid && hands[i].server == guild_id){
						console.log("Slicing a hand.");
						hands.splice(i, 1);
						i--;
					}
				}
				board.splice(temp,1);
				console.log("Game finished");
			}
			break;
			
		case 'end_game':
			kill_game(author_id, guild_id)
			break;
        }
  	}
});

async function auto_turn(positions, hand, callback){
	console.log(`The hand is:`)
	console.log(hand)
	var picked = -1;
	var row = -1;
	var col = -1;
	var flatpos = -1;
	var maybe = Math.floor(Math.random() * 5);
	var row = Math.floor(Math.random() * 3);
	var col = Math.floor(Math.random() * 3);
	while (picked < 0){
		if (hand[maybe].used!=1)picked=maybe
		else if(maybe==0) maybe=4
		else maybe-= 1
	}
	picked++;
	var found = -1;
	while (found==-1){
		if (positions[row][col]==-1) found = 1
		else if (col < 2)col+=1
		else if (row < 2){ 
			 row+=1
			 col=0
		}
		else{
			row = 0;
			col = 0;
		}
	}
	flatpos = row*3;
	flatpos += col;
	flatpos++;
	callback(`rp!triplace ${picked} ${flatpos}`)
	
}

function kill_game(user_id, server_id){
	var board_index = -1;
	var board_lock = -1;
	console.log(`Number of boards is ${board.length}`);
	for (var i = 0; i < board.length; i++){
		if (board[i].initiator == user_id || board[i].challenged==user_id) 
		{
			if (board[i].server == server_id){
				board_index = i;
				board_lock= board[i].lock;
				break;
			}
		}
	}
	if (board_index==-1)return;
	board.splice(board_index, 1);
	for (var i = 0; i < hands.length;i++){
		if(hands[i].board==board_lock){
			hands.splice(i, 1);
			i--;
		}
	}
}

function print_made_cards(rows, callback){
	var output = "CID   Total               Up               Left               Right          Down                 XP                    Name\n";
	var allcards = []
	rows.forEach(function(row){ allcards.push({xp: row.xp,cid: row.char_id, up: row.upval, down: row.downval, left: row.leftval, right: row.rightval, name: row.name, total: row.upval+row.downval+row.leftval+row.rightval})});
	for(var i = 0; i < allcards.length; i++){
		if (allcards[i].cid/10 < 1) output += "0"
		if (allcards[i].cid/100 < 1) output += "0"
		output += allcards[i].cid;
		var bigbuff = "                                        ";
		var lilbuff = bigbuff.slice(0,19);
		output += "         ";
		output += allcards[i].total;
		output += lilbuff;
		output += allcards[i].up;
		output += lilbuff;
		output += allcards[i].left;
		output += lilbuff;
		output += allcards[i].right;
		output += lilbuff;
		output += allcards[i].down;
		output += lilbuff;
		if(allcards[i].xp < 10) output +="0";
		if(allcards[i].xp < 100) output +="0";
		if(allcards[i].xp > 999){
			var divthous = (((allcards[i].xp)-(allcards[i].xp%1000))/1000);
			var rest = allcards[i].xp%1000;
			var dec = (((rest)-(rest%100))/100)
			output +=divthous;
			output +=".";
			output += dec;
			output += "k";
		}
		else output += allcards[i].xp
		output += lilbuff;
		output += "     ";
		output += allcards[i].name;
		output += '\n';
	}
	callback(output);
}

Client.login(process.env.BOT_TOKEN);

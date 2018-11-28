function add_info(k, v){
    console.log('in the add info function');
    var  pg  = require('pg');
    //var c = "postgres://tfxdiyrtqafcsg:016d85a5be0b32198c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319@ec2-54-225-110-156.compute-1.amazonaws.com:5432/dcaet7lhppmpnr";
    //c += "?ssl=true";
    /*
     user: undefined,
2018-11-24T22:46:18.956485+00:00 app[worker.1]:      database: undefined,
2018-11-24T22:46:18.956487+00:00 app[worker.1]:      port: 5432,
2018-11-24T22:46:18.956489+00:00 app[worker.1]:      host: 'localhost',
2018-11-24T22:46:18.956491+00:00 app[worker.1]:      password: null,
2018-11-24T22:46:18.956492+00:00 app[worker.1]:      binary: false,
2018-11-24T22:46:18.956494+00:00 app[worker.1]:      ssl: true,
*/
    var pg_client = new pg.Client({
  user: 'tfxdiyrtqafcsg',
  host: 'ec2-54-225-110-156.compute-1.amazonaws.com',
  password: '016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319',
  //password: '016d85a5be0b32798c3380daf41972fd16c7ace8802f4cc43d95ee42e1bbc319',
  port: 5432,
  database: 'dcaet7lhppmpnr',
  ssl: true,
});
    pg_client.connect();
    console.log('CONNECTION INFO');
    console.log(pg_client);
    
    var endTime = new Date().getTime()+5000;
    while (new Date().getTime() < endTime)
    {
     continue;    
    }
    console.log('5 seconds later...');
    var make_table = "CREATE TABLE Testimundo ( ID int SERIAL PRIMARY KEY, InfoKey varchar(255) NOT NULL, InfoValue varchar(255) NOT NULL)";
    
    var insert_query = "INSERT INTO Info (InfoKey, InfoValue) VALUES($1, $2)";
    var values = [k, v];
    console.log(values);
    pg_client.query(make_table); 
    console.log('THIS IS AFTER TABLE CREATION');
    
    
    var ins = pg_client.query(insert_query, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('success?')
    
  } //end else
})//end query
    console.log('LOGGING INS');
    console.log(ins);

    console.log('ending connection');
    pg_client.end();
    
}//end function


var Discord = require('discord.js');
var Client = new Discord.Client();
 var Momo = require('pg');
var constring = process.env.DATABASE_URL + "?ssl=true";
var MO = new Momo.Client();
var make_table = "CREATE TABLE Testimundo ( ID int SERIAL PRIMARY KEY, InfoKey varchar(255) NOT NULL, InfoValue varchar(255) NOT NULL);";
var insert_query = "INSERT INTO Info (InfoKey, InfoValue) VALUES($1, $2)";
var values = ['Ice', 'Cold'];
console.log('SO SICK OF THIS');

Momo.connect(constring, function(err, client, done) {
   client.query(make_table, function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});

console.log('TABLE MADE???');


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
                //add_info(info_key, info_content);
                barebones();
                break;
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

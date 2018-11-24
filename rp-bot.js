function add_info(k, v){
    console.log('in the add info function');
    const  pg  = require('pg');
    const pg_client = new pg.Client(process.env.DATABASE_URL);

    pg_client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }//end else
})//end amb function
    var endTime = new Date().getTime() + 5000;
    console.log('starting count');
    while (new Date().getTime() < endTime)
    {
     continue;    
    }
    console.log('5 seconds later...');
    var make_table = "CREATE TABLE Infos ( ID int NOT NULL AUTO_INCREMENT, InfoKey varchar(255) NOT NULL, InfoValue varchar(255) NOT NULL, PRIMARY KEY (ID))";
    
    var insert_query = "INSERT INTO Infos (InfoKey, InfoValue) VALUES($1, $2)";
    var values = [k, v];
    console.log(values);
    pg_client.query(make_table); 
    pg_client.query(insert_query, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('success?')
    
  } //end else
})//end query
    console.log('ending connection');
    pg_client.end();
    
}//end function


const Discord = require('discord.js');
const Client = new Discord.Client();

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
                add_info(info_key, info_content);
                break;
        }
  	}
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

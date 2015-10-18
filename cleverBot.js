var Cleverbot = require('cleverbot.io');

exports.respond = function(theRequest, callback){
  if (theRequest.text && (
        theRequest.text.trim().toLowerCase().startsWith('robot, ') ||
        theRequest.text.trim().toLowerCase().startsWith('robot: ') ||
        theRequest.text.trim().toLowerCase().startsWith('robot friend, ') ||
        theRequest.text.trim().toLowerCase().startsWith('robot friend: ')
      )){
    console.log('cleverbot');
    var trim;
    if (theRequest.text.trim().toLowerCase().startsWith('robot friend')){
      trim = 14; //remove "robot friend, "
    } else {
      trim = 7; //remove "robot, "
    }
    var bot = new Cleverbot(process.env.CLEVERBOT_USER, process.env.CLEVERBOT_KEY); // Set up keys

    bot.setNick(process.env.CLEVERBOT_SESSION); // Set a nickname

    bot.create(function (err, session) { // Initialize Cleverbot
    	bot.ask(theRequest.text.trim().substring(trim), function (err, response) {
    		callback(true, response);
    	});
    });
  } else {
    callback(false);
  }
}

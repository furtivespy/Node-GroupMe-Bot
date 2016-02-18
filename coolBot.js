/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');
var flip = require('flip');
var redis = require('redis');

if (process.env.REDIS_URL) {
  var redisurl = require("url").parse(process.env.REDIS_URL);
  var client = redis.createClient(redisurl.port, redisurl.hostname);
  client.auth(redisurl.auth.split(":")[1]);
} else {
  var client = redis.createClient();
}

exports.respond = function(theRequest, callback){
  var botRegex = /^\/cool guy$/;

  if (theRequest.text && botRegex.test(theRequest.text)) {
    console.log('cool face');
    callback(true, cool());
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/flip ')) {
    client.set('iJustFlipped', theRequest.text.trim().substring(6));
    callback(true, '(╯°□°）╯︵' + flip(theRequest.text.trim().substring(6)));
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/unflip')) {
    client.get('iJustFlipped', function(anErr, wasFlipped) {
                callback(true, wasFlipped + "ノ( º _ ºノ)");
              });
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('robohelp')){
    callback(true, 'I\'m a robot and I respond to certain messages that start with: \n' +
                    '"/cool guy" and I make a funny face. \n' +
                    '"Should I" and I\'ll let you know if you should.\n' +
                    '"/roll [dice]" and I\'ll roll some dice for you.\n' +
                    '"robot" and you can chat with me.\n' +
                    '"/Jeopardy" for some trivia. use "a-" to try and answer.\n' +
                    '"/Hangman" to start (or check the status of) a game of hangman.\n' +
                    '"/chuck", "/chuck me", or "/chuck {insert name here}" for a Chuck Norris type joke.\n' +
                    '"gm [search]" to search gifme for a gif or "g [search]" to search giphy and gifme for a gif.\n' +
                    'And of course you found this "robohelp" ' + cool());

  } else {
    callback(false);
  }
}

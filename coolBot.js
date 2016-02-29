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
  } else if (theRequest.text && (theRequest.text.trim().toLowerCase().startsWith('robohelp') || theRequest.text.trim().toLowerCase().startsWith('/help'))) {
    callback(true, 'I\'m a robot and I respond to certain messages that start with: \n' +
                    '"g {search}" or "gm {search}" for a gif. (gm has a tendancy to be a little more dirty (after 6pm)) .\n' +
                    '"/cool guy" - face. "/joke" - fun joke. "/cat" - cat fact. "/advice" - advice. "/fortune" - fortune cookie. \n' +
                    'Want some quotes? "/simpsons" | Ron "/swanson" | "/friends" | "/MST" | "/TNG" are all quotes \n' +
                    '"/insult {someone}" and I\'ll direct an insult at {someone}. \n' +
                    '"/define {something}" and I\'ll get the Urban definition or just "/define" for a random definition. \n' +
                    '"/slogan {something}" and I\'ll make up a slogan for that something. \n' +
                    '"/chuck", "/chuck me", or "/chuck {someone}" for a Chuck Norris type joke.\n' +
                    '"/flip {something}" and I\'ll flip that something, but "/unflip" and I\'ll put it back.\n' +
                    '"/roll {dice}" and I\'ll roll some dice for you.\n' +
                    'Try a game of "/Jeopardy" (use "a-" to answer) or "/Hangman".\n' +
                    'start with "robot" and you can chat with me. or sometimes I\'ll just chime in.\n');

  } else {
    callback(false);
  }
}

/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');

exports.respond = function(theRequest, callback){
  var botRegex = /^\/cool guy$/;

  if (theRequest.text && botRegex.test(theRequest.text)) {
    console.log('cool face');
    callback(true, cool())
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('robot help')){
    callback(true, 'I\'m a robot and I respond to certain messages that start with: \n' +
                    '"/cool guy" and I make a funny face. \n' +
                    '"Should I" and I\'ll let you know if you should.\n' +
                    '"/roll [dice]" and I\'ll roll some dice for you.\n' +
                    '"robot" and you can chat with me.\n' +
                    '"/Jeopardy" for some trivia. use "a-" to try and answer.\n' +
                    '"/Hangman" to start (or check the status of) a game of hangman.\n' +
                    '"/chuck" for a Chuck Norris joke or "/chuck me" for a you version of the joke.\n' +
                    '"gm [search]" to search gifme for a gif or "g [search]" to search giphy and gifme for a gif.\n' +
                    'And of course you found this "robohelp" ' + cool());

  } else {
    callback(false);
  }
}

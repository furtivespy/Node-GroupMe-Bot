/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');

exports.respond = function(theRequest, callback){
  var botRegex = /^\/cool guy$/;

  if (theRequest.text && botRegex.test(theRequest.text)) {
    console.log('cool face');
    callback(true, cool())
  } else if (theRequest.text && (theRequest.text.trim().toLowerCase().startsWith('robot help') || theRequest.text.trim().toLowerCase().startsWith('robohelp'))){
    callback(true, 'I\'m a robot and I respond to certain messages that start with:');
    callback(true, '"/cool guy" and I make a funny face ' + cool());
    callback(true, '"Should I" and I\'ll let you know if you should.');
    callback(true, '"roll [dice]" and I\'ll roll some dice for you.');
    callback(true, '"robot," or "robot friend," and you can chat with me.');
    callback(true, '"Jeopardy" for some trivia. use "a-" to try and answer.');
    callback(true, '"gm [search]" to search gifme for a gif or "g [search]" to search giphy and gifme for a gif.');
  } else {
    console.log('no face');
    callback(false);
  }
}

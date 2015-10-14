/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');

exports.respond = function(theRequest, callback){
  var botRegex = /^\/cool guy$/;

  if (theRequest.text && botRegex.test(theRequest.text)) {
    console.log('cool face');
    callback(true, cool())
  } else {
    console.log('no face');
    callback(false);
  }
}

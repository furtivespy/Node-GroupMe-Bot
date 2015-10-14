/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');

exports.respond = function(theRequest, callback){
  var botRegex = /^\/cool guy$/;

  if (theRequest.text && botRegex.test(theRequest.text)) {
    callback(true, cool())
  } else {
    callback(false);
  }
}

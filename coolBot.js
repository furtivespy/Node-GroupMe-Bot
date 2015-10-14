/* The Basic Cool Face Bot */
var cool = require('cool-ascii-faces');

exports.respond(theRequest, callback){
  var botRegex = /^\/cool guy$/,

  if (request.text && botRegex.test(request.text)) {
    callback(true, cool())
  } else {
    callback(false);
  }
}

var request = require('request');
var qs = require( 'querystring' );

exports.respond = function(theRequest, callback){
   if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/chuck me')){
      getJoke(theRequest, callback, theRequest.name);
 } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/chuck')){
      getJoke(theRequest, callback);
 } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('dennis')){
      getJoke(theRequest, callback, 'Dennis Flanders');
 } else {
   callback(false);
 }
}

function getJoke(theRequest, callback, name) {
  var query;
  if (name === undefined) {
      query = "escape=javascript";
  } else {
      query = qs.stringify( {escape: 'javascript', firstName: name, lastName: ''});
  }
  request({url: 'http://api.icndb.com/jokes/random?' + query, json: true }, function(error, response, body) {
    callback(true, body.value.joke.replace(/  /g, " "));
  });
}

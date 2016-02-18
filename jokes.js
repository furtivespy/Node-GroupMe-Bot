var request = require('request');

exports.respond = function(theRequest, callback){
   if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/joke')){
      getJoke(theRequest, callback);
   callback(false);
 }
}

function getJoke(theRequest, callback) {
  request({url: 'http://jokels.com/random_joke', json: true }, function(error, response, body) {
    callback(true, body.joke.question);
    setTimeout(function() { callback(true, body.joke.answer); }, 1500);
  });
}

var request = require('request');
var qs = require( 'querystring' );


exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/joke')){
      getJoke(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/slogan')){
      getSlogan(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/cat')){
      getCat(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/advice')){
      getAdvice(theRequest, callback);
  } else {
      callback(false);
  }
}

function getJoke(theRequest, callback) {
  request({url: 'http://jokels.com/random_joke', json: true }, function(error, response, body) {
    callback(true, body.joke.question);
    setTimeout(function() { callback(true, body.joke.answer); }, 1500);
  });
}

function getSlogan(theRequest, callback) {
  var name = theRequest.text.trim().substring(7).trim()
  var query;
  if (name === undefined || name == '') {
      query = "slogan=Robots";
  } else {
      query = qs.stringify( {slogan: name});
  }
  request({url: 'http://www.sloganizer.net/en/outbound.php?' + query}, function(error, response, body) {
    callback(true, body.replace(/<.*?>/g,''));
  });
}

function getCat(theRequest, callback) {
  request({url: 'http://catfacts-api.appspot.com/api/facts', json: true }, function(error, response, body) {
    callback(true, body.facts[0]);
  })
}

function getAdvice(theRequest, callback) {
  request({url: 'http://api.adviceslip.com/advice', json: true }, function(error, response, body) {
    callback(true, body.slip.advice);
  })
}
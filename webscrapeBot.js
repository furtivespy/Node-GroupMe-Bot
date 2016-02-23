var request = require('request');
var qs = require( 'querystring' );
var cheerio = require('cheerio');

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/simpsons')){
      getSimpsons(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/insult')){
      getInsult(theRequest, callback);
  } else {
      callback(false);
  }
}

function getSimpsons(theRequest, callback) {
	request({url: 'http://www.randomsimpsonsquote.com/'}, function(error, response, body) {
    	$ = cheerio.load(body);
    	callback(true, $('blockquote').text());
  	});
}

function getInsult(theRequest, callback){
	request({url: 'http://www.randominsults.net'}, function(error, response, body) {
    	$ = cheerio.load(body);
    	callback(true, theRequest.text.substring(7).trim() + ': ' +  $('i').text());
  	});
}
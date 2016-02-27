var request = require('request');
var qs = require( 'querystring' );
var cheerio = require('cheerio');

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/simpsons')){
      getSimpsons(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/insult')){
      getInsult(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/define')){
      getDefinition(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/friends')){
      getFriends(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('/mst')){
      getMst3k(theRequest, callback);
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

function getDefinition(theRequest, callback){
	var word = theRequest.text.trim().substring(7).trim()
	var url;
	if (word === undefined || word == '') {
		url = 'http://www.urbandictionary.com/random.php';
	} else {
		url = 'http://www.urbandictionary.com/define.php?' + qs.stringify( {term: word});
	}
	request({url: url }, function(error, response, body) {
    	$ = cheerio.load(body);
	    	if ($('.word').length > 0) {
	    	callback(true, $('.word').first().text() + ": " + $('.meaning').first().text());
	    	callback(true, $('.example').first().text());
    	} else {
    		callback(true, word + ' is a way to confuse robots.');
    	}
  	});
}

function getFriends(theRequest, callback){
	request({url: 'https://en.wikiquote.org/wiki/Friends_(TV_series)'}, function(error, response, body) {
    	$ = cheerio.load(body);
    	var ranItem = Math.floor( (Math.random() * $('dl').length) + 1 );
    	var quote = '';
    	$('dl:nth-child(' + ranItem + ')').children('dd').each(function(i,elem){
    		quote = quote +  $(this).text().replace(/<.*?>/g,'') + '\n';
    	});
    	callback(true, quote);
  	});
}

function getMst3k(theRequest, callback){
	request({url: 'https://en.wikiquote.org/wiki/Mystery_Science_Theater_3000'}, function(error, response, body) {
    	$ = cheerio.load(body);
    	var ranItem = Math.floor( (Math.random() * $('dl').length) + 1 );
    	var quote = '';
    	$('dl:nth-child(' + ranItem + ')').children('dd').each(function(i,elem){
    		quote = quote +  $(this).text().replace(/<.*?>/g,'') + '\n';
    	});
    	callback(true, quote);
  	});
}
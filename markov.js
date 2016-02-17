var redis = require('redis');
var deck = require('deck'); //for good random selection
var endWord = '\x03';
var roboResponseChance = .02;
var prefix = 'markov';

if (process.env.REDIS_URL) {
  var redisurl = require("url").parse(process.env.REDIS_URL);
  var client = redis.createClient(redisurl.port, redisurl.hostname);
  client.auth(redisurl.auth.split(":")[1]);
} else {
  var client = redis.createClient();
}

exports.respond = function(theRequest, callback){
	if (!theRequest.text ||
		 theRequest.text.trim().toLowerCase().startsWith('/') ||
		 theRequest.name.toLowerCase().startsWith('robot') ||
		 theRequest.text.trim().toLowerCase().startsWith('g ') ||
		 theRequest.text.trim().toLowerCase().startsWith('gm ')) {
		callback(false); //do nothing in these cases
	} else {
		var words = theRequest.text.trim().toLowerCase().replace(/:/g,'').split(/\s+/).filter(function(thisArg){ return (thisArg.length > 0); });
		var mustRespond = false;
		if (words[0] == 'robot,' || words[0] == 'robot'){
			words.shift();
			mustRespond = true;
		}
		if (mustRespond || Math.random() <= roboResponseChance) { //Respond!
			var x = Math.floor(Math.random() * (words.length))
			var y = Math.floor(Math.random() * (words.length))
			console.log('Robot Response: ' + x +  ' ' + y);
			createChain(words[x],words[y], callback); //start with 2 random words from what was said.
		}
		log(words);
		callback(false);
	}
}

function log(message){
	if (message.length > 3) { //only log things longer than 3 words.
		message.push(endWord);
		while (message.length > 2)
		{
			client.zincrby(makeKey(message[0],message[1]), 1, message[2]);
			console.log(message[0] + ':' + message[1] + ' - ' + message[2]);
			message.shift();
		}
	}
}

function makeKey(prev, next){
	return prefix + ':' + prev + ":" + next;
}

function createChain(seed1,seed2, cb) {
	var chain = []; 
	console.log('making chain - ' + seed1 + ' ' + seed2);
	client.exists(makeKey(seed1,seed2), function(err, members){
		if (members != 1) {
			getRandomStart(cb); //if 2 random words don't exist together in dictionary, just get a random key to start on.
		}  else {
			chain.push(seed1);
			chain.push(seed2);
			buildPhrase(chain,cb);
		}
	});
}

function getRandomStart(cb)
{
	client.randomkey(function(result,key){
		if (key.startsWith(prefix)) { //make sure the random key is part of the markov chains
			var words = [];
			words.push(key.split(':')[1]);
			words.push(key.split(':')[2]);
			buildPhrase(words,cb);
		}
		else getRandomStart(cb);
	})
}

function buildPhrase(thePhrase, cb){
	client.zrange(makeKey(thePhrase[thePhrase.length-2],thePhrase[thePhrase.length-1]),0,-1,'withscores',function(err, members){
		console.log(thePhrase.join(' '));
		var words = {};
		for (i=0,j=members.length; i<j; i+=2) {
    		var temparray = members.slice(i,i+2);
    		words[temparray[0]] = parseInt(temparray[1]);
		}
		var newWord = deck.pick(words); //pick a random word (weighted based on usual use)
		console.log('add: ' + newWord);
		if (newWord == endWord || thePhrase.length > 35){ //if the new word says to end the sentance or bot is getting too chatty, then send phrase
			cb(true, thePhrase.join(' '));
		} else {
			buildPhrase(thePhrase.push(newWord),cb);
		}
	})
	
}
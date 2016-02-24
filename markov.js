var redis = require('redis');
var deck = require('deck'); //for good random selection
var endWord = '\x03';
var roboResponseChance = process.env.ROBOT_TALK_PRECENTAGE; //% chance to randomly talk
var prefix = 'markov';
var constructedPhrase = [];

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
		 theRequest.text.trim().toLowerCase().startsWith('g ') ||
		 theRequest.text.trim().toLowerCase().startsWith('gm ')) {
		callback(false); //do nothing in these cases
	} else {
		var words = theRequest.text.trim().toLowerCase().replace(/:/g,'').split(/\s+/).filter(function(thisArg){ return (thisArg.length > 0); });
		var mustRespond = false;
		if (words[0] == 'robot,' || words[0] == 'robot' || words[0] == process.env.ROBOT_NAME || words[0] == process.env.ROBOT_NAME + ','){
			words.shift();
			mustRespond = true;
		}
		if (mustRespond || (Math.floor(Math.random() * 100) <= roboResponseChance)) { //Respond!
			var x = Math.floor(Math.random() * (words.length))
			var y = Math.floor(Math.random() * (words.length))
			console.log('Robot Response: ' + x +  ' ' + y);
			constructedPhrase = []; //reset phrase!
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
	console.log('making chain - ' + seed1 + ' ' + seed2);
	client.exists(makeKey(seed1,seed2), function(err, members){
		if (members != 1) {
			getRandomStart(cb); //if 2 random words don't exist together in dictionary, just get a random key to start on.
		}  else {
			constructedPhrase.push(seed1);
			constructedPhrase.push(seed2);
			buildPhrase(cb);
		}
	});
}

function getRandomStart(cb)
{
	client.randomkey(function(result,key){
		if (key.startsWith(prefix)) { //make sure the random key is part of the markov chains
			constructedPhrase.push(key.split(':')[1]);
			constructedPhrase.push(key.split(':')[2]);
			buildPhrase(cb);
		}
		else getRandomStart(cb);
	})
}

function buildPhrase(cb){
	client.zrange(makeKey(constructedPhrase[constructedPhrase.length-2],constructedPhrase[constructedPhrase.length-1]),0,-1,'withscores',function(err, members){
		var words = {};
		for (i=0,j=members.length; i<j; i+=2) {
    		var temparray = members.slice(i,i+2);
    		words[temparray[0]] = parseInt(temparray[1]);
		}
		var newWord = deck.pick(words); //pick a random word (weighted based on usual use)
		console.log('add: ' + newWord);
		if (newWord == endWord || constructedPhrase.length > 40){ //if the new word says to end the sentance...
			if (constructedPhrase.length < 8) {
				constructedPhrase.push("...");
				getRandomStart(cb);
			} else {
				cb(true, constructedPhrase.join(' '));	
			}
			
		} else {
			constructedPhrase.push(newWord);
			buildPhrase(cb);
		}
	})
	
}
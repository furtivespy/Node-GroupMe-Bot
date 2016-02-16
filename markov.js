var redis = require('redis');
var deck = require('deck'); //for good random selection
var endWord = '\x03';
var roboResponseChance = .01;
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
		log(words);
		if (mustRespond || Math.random() <= roboResponseChance) { //Respond!
			var x = Math.floor(Math.random() * (words.length-1))
			console.log('Robot Response:');
			var newWords = createChain(words[x],words[x+1]);
			console.log(newWords.join(' '));
			callback(true, newWords.join(' '));
		}
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

function createChain(seed1,seed2) {
	var chain[]; 
	console.log('making chain - ' + seed1 + ' ' + seed2);
	client.exists(makeKey(seed1,seed2), function(err, members){
		if (members != 1) {
			var key = getRandomStart();
			seed1 = key.split(':')[1];
			seed2 = key.split(':')[2];
		}  
		chain.push(seed1);
		chain.push(seed2);
		for (i=0;i<30;i++){
			var aword = nextWord(makeKey(seed1,seed2));
			if (aword == endWord)
				i=30;
			else
				chain.push(aword);
			seed1=seed2;
			seed2=aword;
		}	
		console.log(chain.join(' '));
		return chain;
	})
	
}

function getRandomStart()
{
	client.randomkey(function(result,key){
		if (key.startsWith(prefix)) 
			return key;
		else return getRandomStart();
	})
}

function nextWord(key){
	client.zrange(key,0,-1,'withscores',function(err, memebers){
		var words = {};
		for (i=0,j=memebers.length; i<j; i+=2) {
    		temparray = array.slice(i,i+2);
    		words[temparray[0]] = temparray[1];
		}
		return deck.pick(words)	
	})
	
}
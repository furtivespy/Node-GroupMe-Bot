var HTTPS = require('https');
var gifBot = require('./gifBot.js');
var coolBot = require('./coolBot.js');
var yesnoBot = require('./yesnoBot.js');
var diceBot = require('./diceBot.js');
var cleverbot = require('./cleverBot.js');
var jeopardybot = require('./jeopardy.js');
var chuck = require('./chuckBot.js');
var hangman = require('./hangmanBot.js');
var markov = require('./markov.js');
var ferengi = require('./ferengi.js');
var jokes = require('./jokes.js');
var botID = process.env.BOT_ID;


function respond() {
  var request = JSON.parse(this.req.chunks[0]);

  //testing... what data did we get:
  console.log(JSON.stringify(this.res));

  //I should to do this in an array, but whatever.
  coolBot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  gifBot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  yesnoBot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  diceBot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  //cleverbot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  jeopardybot.respond(request, function(send, data) { botCallback(send, data, this.res)});
  chuck.respond(request, function(send, data) { botCallback(send, data, this.res)});
  hangman.respond(request, function(send, data) { botCallback(send, data, this.res)});
  markov.respond(request, function(send, data) { botCallback(send, data, this.res)});
  ferengi.respond(request, function(send, data) { botCallback(send, data, this.res)});
  jokes.respond(request, function(send, data) { botCallback(send, data, this.res)});
}

function botCallback(sendMessage, messageData, res){
  if(sendMessage) {
    postMessage(messageData);
  }
}

function postMessage(botResponse) {
  var options, body, botReq;

  //botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

exports.respond = respond;

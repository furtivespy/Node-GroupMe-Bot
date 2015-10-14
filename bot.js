var HTTPS = require('https');
var gifBot = require('./gifBot.js');
var coolBot = require('./coolBot.js');
var botID = process.env.BOT_ID;

var allBots[];

function respond() {
  var request = JSON.parse(this.req.chunks[0]);

  allBots.push(coolBot);
  allBots.push(gifBot);

  allBots.each(function() {
    this.respond(request, botCallback);
  });
  this.res.writeHead(200);
}

function botCallback(sendMessage, messageData){
  if(sendMessage) {
    postMessage(messageData);
  }
  allBots.pop();
  if(allBots.length <= 0){
    this.res.end();
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

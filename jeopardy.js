var request = require('request');
var redis = require('redis');

if (process.env.REDIS_URL) {
  var redisurl = require("url").parse(process.env.REDIS_URL);
  var client = redis.createClient(redisurl.port, redisurl.hostname);
  client.auth(redisurl.auth.split(":")[1]);
} else {
  var client = redis.createClient();
}

exports.respond = function(theRequest, callback){
  client.get('isQuestionOutstanding', function(err, isQuestionOutstanding) {
    if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('jeopardy')){
      console.log('jeopardy');
      if (isQuestionOutstanding == 'yes'){
        client.get('currentAnswer', function(er, currentAnswer) {
          callback(true, "The previous answer was: " + currentAnswer);
          sendNewQuestion(callback);
        });
      } else {
        sendNewQuestion(callback);
      }
    } else if (theRequest.text && isQuestionOutstanding == 'yes' && (theRequest.text.trim().toLowerCase().startsWith('a:') || theRequest.text.trim().toLowerCase().startsWith('a-'))){
      client.get('currentAnswer', function(er, currentAnswer) {
        console.log('Answer is ');
        if(currentAnswer.toLowerCase() == theRequest.text.toLowerCase().substring(2).trim()){
          console.log('Answer is correct!');
          client.set('isQuestionOutstanding', 'no');
          client.get('currentValue', function(anErr, currentValue) {
              client.incrby("score:" + theRequest.sender_id, currentValue, function (anotherErr, newScore) {
                callback(true, "Correct! " + theRequest.name + ", you now have $" + newScore);
              });
          });
        } else {
          callback(true, "Sorry, " + theRequest.text.toLowerCase().substring(2).trim() + " is not the answer.");
        }
      });
    } else {
      callback(false);
    }
  });
}

function sendNewQuestion(sendmessage){
  console.log('sending new jeopardy...');
  request({url: 'http://jservice.io/api/random', json: true }, function(error, response, body) {
    client.set('currentAnswer', body[0].answer);
    client.set('currentValue', body[0].value);
    client.set('isQuestionOutstanding', 'true');
    sendmessage(true, body[0].category.title + " for $" + body[0].value);
    sendmessage(true, body[0].question);

  });
}

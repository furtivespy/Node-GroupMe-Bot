var request = require('request');
var qs = require( 'querystring' );
var redis = require('redis');

if (process.env.REDIS_URL) {
  var redisurl = require("url").parse(process.env.REDIS_URL);
  var client = redis.createClient(redisurl.port, redisurl.hostname);
  client.auth(redisurl.auth.split(":")[1]);
} else {
  var client = redis.createClient();
}

exports.respond = function(theRequest, callback){
  if (theRequest.text){
    client.get('isPlayingHangman', function (error, isPlayingHangman){
      if(isPlayingHangman == 'yes'){
        client.get('theHangmanGame', function (err, theHangmanGame){
          var hangingGame = JSON.parse(theHangmanGame);
          if (theRequest.text.trim().toLowerCase().startsWith('hangman')){
            showGallows(callback, hangingGame);
          } else if (theRequest.text.trim().toLowerCase().match(/^[a-z]$/)){
            var aGuess = theRequest.text.trim().toLowerCase();
            if (hangingGame.guessedLetters.indexOf(aGuess) < 0) { //new letter
              hangingGame.guessedLetters.push(aGuess);
              if (hangingGame.theWord.indexOf(aGuess) < 0) { //wrong
                hangingGame.numWrong++;
                if (hangingGame.numWrong > 5) { //GAME OVER MAN!
                  showGallows(callback, hangingGame);
                  callback(true, 'You Lose! The word was ' + hangingGame.theWord);
                  client.set('isPlayingHangman', 'no');
                }
              } else { //RIGHT!
                showGallows(callback, hangingGame);
                var win = true;
                for (var i = 0, len = gameObject.theWord.length; i < len; i++) {
                  if (guessedLetters.indexOf(gameObject.theWord[i]) < 0) {
                    win = false;
                  }
                }
                if (win){
                  callback(true, 'Congratulations. The man was not hanged!');
                  client.set('isPlayingHangman', 'no');
                } else {
                  client.set('theHangmanGame', JSON.stringify(hangingGame));
                }
              }
            } else { //Old letter
              //showGallows(callback, hangingGame);
              //Ignore input!
            }
          }
        });
      } else if (theRequest.text.trim().toLowerCase().startsWith('hangman')){
        var query;
        query = qs.stringify( {hasDictionaryDef: 'false',
                               minCorpusCount: 0,
                               maxCorpusCount: -1,
                               minDictionaryCount: 1,
                               maxDictionaryCount: -1,
                               minLength: 5,
                               maxLength: -1,
                               api_key: process.env.WORDNIK_KEY});

        request({url: 'http://api.wordnik.com:80/v4/words.json/randomWord?' + query, json: true }, function(error, response, body) {
          var newHangingGame = {};
          newHangingGame.theWord = body.word;
          newHangingGame.numWrong = 0;
          newHangingGame.guessedLetters = [];
          client.set('theHangmanGame', JSON.stringify(newHangingGame));
          client.set('isPlayingHangman', 'yes');
          showGallows(callback, newHangingGame);
        });
      }
    });
  }
}

function showGallows(chatCall, gameObject){
  var hangword = "";
  for (var i = 0, len = gameObject.theWord.length; i < len; i++) {
    if (gameObject.guessedLetters.indexOf(gameObject.theWord[i]) < 0) {
      hangword += '_ ';
    } else {
      hangword += gameObject.theWord[i] + ' ';
    }
  }
  chatCall(true, 'The Hangman Word: ' + hangword + '\n' +
                 '    _______\n' +
                 '   |/      |\n' +
                 '   |      ' + ((gameObject.numWrong > 0)?'(_)':'') + '\n' +
                 '   |      ' + ((gameObject.numWrong > 2)?'\\':' ') + ((gameObject.numWrong > 1)?'|':'') + ((gameObject.numWrong > 3)?'/':'') + '\n' +
                 '   |       ' + ((gameObject.numWrong > 1)?'|':'') + '\n' +
                 '   |      ' + ((gameObject.numWrong > 4)?'/':'') + ' ' + ((gameObject.numWrong > 5)?'\\':'') + '\n' +
                 '   |\n' +
                 '___|___ Guessed: ' + gameObject.guessedLetters.join(','));
}

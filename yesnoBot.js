var request = require('request');

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('should i ')){
    console.log('YES or NO?');
    request('http://yesno.wtf/api', function(error, response, body) {
      callback(true, body.answer);
      callback(true, body.image);
    });
  } else {
    callback(false);
    callback(false);
  }
}

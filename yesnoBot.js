var request = require('request');

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('should ')){
    console.log('YES or NO?');
    request({url: 'http://yesno.wtf/api', json: true }, function(error, response, body) {
      //console.log(JSON.stringify(body));
      callback(true, body.answer);
      callback(true, body.image);
    });
  } else {
    callback(false);
    callback(false);
  }
}

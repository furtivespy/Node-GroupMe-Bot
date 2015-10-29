var Roll = require('roll');

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('roll ')){
    console.log('Let\'s Roll');
    var roll = new Roll();
    if (roll.validate(theRequest.text.trim().substring(5))){
      var rolling = roll.roll(theRequest.text.trim().substring(5));
      callback(true, theRequest.name + ' rolled ' + rolling.rolled + ' for a total of: ' + rolling.result);
    } else {
      callback(true, 'I don\'t know how to roll ' + theRequest.text.trim().substring(5));
    }
  } else {
    callback(false);
  }
}

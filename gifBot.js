/* A Gif Posting bot */

var giphy = require( 'giphy' )( process.env.GIPHY_KEY );

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('g ')){
    console.log('searching ' + theRequest.text.trim().substring(2));
    giphy.search({ q : theRequest.text.trim().substring(2), limit:10 }, function (err, thedata, res) {
      processGiphy(err, thedata, res, theRequest, callback);
    });
  } else {
    callback(false);
  }
}

function processGiphy(err, thedata, res, theRequest, callback){
  console.log('posting...');
  if (thedata.data){
    var i = Math.floor((Math.random() * thedata.data.length));
    if(thedata.data[i] && thedata.data[i].images && thedata.data[i].images.original){
      callback(true, thedata.data[i].images.original.url);
    } else {
      callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(2) + ' gifs found.');
    }
  } else {
    callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(2) + ' gifs found.');
  }
}

/* A Gif Posting bot */

var giphyKey = process.env.GIPHY_KEY;
var giphy = require( 'giphy' )( giphyKey );

exports.respond = function(theRequest, callback){
  if (request.text && request.text.trim().toLowerCase().startsWith('g ')){
    giphy.search({ q : request.text.trim().substring(2), limit:10 }, function (err, thedata, res) {
      processGiphy(err, thedata, res, theRequest, callback);
    });
  } else {
    callback(false);
  }
}

function processGiphy(err, thedata, res, theRequest, callback){
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

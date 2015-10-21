/* A Gif Posting bot */
var request = require('request');
var qs = require( 'querystring' );
var giphy = require( 'giphy' )( process.env.GIPHY_KEY );

exports.respond = function(theRequest, callback){
  if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('g ')){
    console.log('searching ' + theRequest.text.trim().substring(2));
    searchGiphy(theRequest, callback);
  } else if (theRequest.text && theRequest.text.trim().toLowerCase().startsWith('gm ')){
    console.log('searching ' + theRequest.text.trim().substring(3));
    searchGifMe(theRequest, callback, 3);
  } else{
    callback(false);
  }
}

function searchGiphy(theRequest, callback) {
  giphy.search({ q : theRequest.text.trim().substring(2), limit:10 }, function (err, thedata, res) {
    processGiphy(err, thedata, res, theRequest, callback);
  });
}

function searchGifMe(theRequest, callback, trim) {
  request({url: 'http://api.gifme.io/v1/search?' + qs.stringify( {
            query: theRequest.text.trim().substring(trim),
            limit: 25,
            page: 0,
            swf: 'false',
            key: process.env.GIFME_KEY }),
          json: true },
          function(error, response, body) {
            //console.log(body);
            if (body.data){
              var i = Math.floor((Math.random() * body.data.length));
              if(body.data[i] && body.data[i].link){
                callback(true, body.data[i].link);
              } else {
                callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(trim) + ' gifs found.');
              }
            } else {
              callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(trim) + ' gifs found.');
            }
          });
}

function processGiphy(err, thedata, res, theRequest, callback){
  //console.log('posting...');
  if (thedata.data){
    var i = Math.floor((Math.random() * thedata.data.length));
    if(thedata.data[i] && thedata.data[i].images && thedata.data[i].images.original){
      callback(true, thedata.data[i].images.original.url);
    } else {
      searchGifMe(theRequest, callback, 2);
      //callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(2) + ' gifs found.');
    }
  } else {
    searchGifMe(theRequest, callback, 2);
    //callback(true, 'Sorry, ' + theRequest.name + ', no ' + theRequest.text.trim().substring(2) + ' gifs found.');
  }
}

var express = require('express');
var app = express();
var Curl = require( 'node-libcurl' ).Curl;
var playlist = [];

var curl = new Curl();
curl.setOpt( 'URL', 'http://www.bbc.co.uk/radio1/playlist.json' );
curl.on( 'end', function( statusCode, body, headers ) {
  playlist = JSON.parse(body).playlist.a;
  playlist.splice(10);
  this.close();
});
curl.on( 'error', curl.close.bind( curl ) );
curl.perform();

app.use(express.static('public'));

app.get('/playlist', function(req, res, next) {
  res.json(playlist);
});

app.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var track = req.query.track;
  console.log('Modifying the DB...');
  for(var i=0; i<playlist.length; i++) {
    if(playlist[i].artist_id == id) {
      playlist[i] = track;
      playlist[i].artist_id = id;
      break;
    }
  }
  res.json(playlist);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

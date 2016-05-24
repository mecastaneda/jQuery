var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/getInfo', function(req, res, next) {
  var chance = Math.random();
  if(chance < 0.5)
    res.send("Hello from the server");
  else
    res.status(404).json({redirect: '/404.html'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

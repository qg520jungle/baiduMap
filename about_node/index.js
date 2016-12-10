// var server = require("./server");
// var router = require("./router");

// server.start(router.route);

var resetSrc = require('./url/post/resetSrc');

var express = require('express');
var app = express();

app.get('/a', function (req, res) {
  res.send(resetSrc.add(req, res));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
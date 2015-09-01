//==========
//===EH LEE LA DOCUMENTACIÓN ACA=====
//==http://expressjs.com/guide/routing.html===
//==Para más detalles de la API MIRA ACA===
//==http://expressjs.com/4x/api.html
var express = require('express');
var app = express();
var io = require('socket.io-client');


app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



var socket = io.connect('http://localhost:3000');

while(true) {
  produce();
}


function produce() {
  socket.emit('mande fruta');
  console.log('mande una consulta');
  sleep(3000);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
            break;
          }
    }
}



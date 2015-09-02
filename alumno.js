//==========
//===EH LEE LA DOCUMENTACIÓN ACA=====
//==http://expressjs.com/guide/routing.html===
//==Para más detalles de la API MIRA ACA===
//==http://expressjs.com/4x/api.html
var express = require('express');
var http = require('http');
var app = express();


var options = {
  hostname: 'localhost',
  port: 3000,
  path: '/alumnoSeConecta',
  method: 'GET'
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

connect();

var interval = setInterval(produce(), 1000);
clearInterval(interval);

function connect() {
  console.log('me conecto');
  http.get('http://localhost:3000/alumnoSeConecta?port=5000', function(res){
    console.log('me conecte');
  });
}

function produce() {
  console.log('envio una consulta');    
  http.get('http://localhost:3000/alumnoEscribe?port=5000&consulta=unaconsulta', function(res){
    console.log('la consulta fue enviada');    
  });
}


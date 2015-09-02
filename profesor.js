//==========
//===EH LEE LA DOCUMENTACIÓN ACA=====
//==http://expressjs.com/guide/routing.html===
//==Para más detalles de la API MIRA ACA===
//==http://expressjs.com/4x/api.html
var express = require('express');
var http = require('http');
var app = express();



app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

//while(true) {
  produce();
//}
function produce() {
  console.log('voy');    
  http.get('http://localhost:3000/profesorSeConecta?miPuerto=4000', function(res){
    console.log('hola');
	    
  });
  //sleep(3000);
}

app.get('/nuevaConsulta', function(req, res){
  console.log('Nueva consulta a un profesor');
var consulta = req.query.consulta
console.log('consulta: ' + consulta);
	res.send('OK');
});




function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
            break;
          }
    }
}




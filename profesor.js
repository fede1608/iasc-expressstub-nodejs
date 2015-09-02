//==========
//===EH LEE LA DOCUMENTACIÓN ACA=====
//==http://expressjs.com/guide/routing.html===
//==Para más detalles de la API MIRA ACA===
//==http://expressjs.com/4x/api.html
var express = require('express');
var http = require('http');
var app = express();
var colors = require('colors');
var _ = require('underscore');

var host = 'http://localhost';
var mailinglist_port = 3000;
var professor_port = 4000;
var address = make_url(host, mailinglist_port);

var server = app.listen(4000, server_listening);

function server_listening(){
  console.log(('A professor is online, listening on port '+ student_port).blue);
  connect();
}

app.get('/nuevaConsulta', function (req, res) {
  console.log('nueva consulta: ', req.query.consulta);
});

function connect() {
  console.log('Connection in progress'.grey);
  http.get(address+'/alumnoSeConecta?port='+student_port, repeat_call);
}

function repeat_call(){
  setInterval(consume, 6000, 'NoAnswer');
}

function consume(answer) {
  console.log('Send new answer to mailing list on port', professor_port);
  http.get(address+'/profesorResponde?port='+professor_port+'&answer='+answer, answer_sent);
}

function answer_sent(res){
  console.log('The answer was sent'.green);
}

function make_url(host, port){
  return host + ':' + port;
}




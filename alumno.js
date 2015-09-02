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
var student_port = 5000;
var address = make_url(host, mailinglist_port);

var server = app.listen(5000, server_listening);

function server_listening(){
  console.log(('A student is online, listening on port '+ student_port).magenta);
  connect();
}

app.get('/nuevaConsulta', function (req, res) {
  console.log('nueva consulta: ', req.query.question);
});

function connect() {
  console.log(('Connection with ' + make_url(host, mailinglist_port) + ' in progress').grey);
  http.get(address+'/alumnoSeConecta?port='+student_port, repeat_call);
}

function repeat_call(){
  setInterval(produce, 5000, 'WhatIsTheMeaningOfLife');
}
function produce(question) {
  console.log('Send new query to mailing list on port', student_port);
  http.get(address+'/alumnoEscribe?port='+student_port+'&question='+question, question_sent);
}

function question_sent(res){
  console.log('The question was sent'.green);
}

function make_url(host, port){
  return host + ':' + port;
}
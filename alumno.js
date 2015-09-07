var express = require('express');
var http = require('http');
var app = express();
var colors = require('colors');
var _ = require('underscore');

var host = 'http://localhost';
var mailinglist_port = 3000;
var student_port = process.env.PORT || 5000;
var address = make_url(host, mailinglist_port);

var Client = require('node-rest-client').Client;
var client = new Client();

var server = app.listen(student_port, server_listening); //continuation

var i = 0;
var misConsultas = [];

function server_listening() {
  console.log(('A student is online, listening on port ' + student_port).magenta);
  connect();
}

function connect() {
  console.log(('Connection with ' + make_url(host, mailinglist_port) + ' in progress').grey);
  client.get(address + '/alumnoSeConecta', {
    parameters: {
      port: student_port
    }
  }, repeat_call);
}

function repeat_call() {
  setInterval(produce, 10000, 'WhatIsTheMeaningOfLife-' + student_port + '-');
}

function produce(question) {
  console.log('Send new query to mailing list on port', student_port);
  var currentQuestion = question + (i++);
  client.get(address + '/alumnoEscribe', {
    parameters: {
      port: student_port,
      question: currentQuestion
    }
  }, question_sent);
  misConsultas.push(currentQuestion);
  console.log('Mis consultas: ' + misConsultas);
}

function question_sent(data, response) {
  console.log('The question was sent'.green);
}

function make_url(host, port) {
  return host + ':' + port;
}

app.get('/nuevaConsulta', function(req, res) {
  console.log('nueva consulta: ', req.query.question);
});

app.get('/profesorRespondio', function(req, res) {
  console.log('profesor respondio: ' + req.query.question);
  //misConsultas.remove(req.query.question);
  misConsultas = misConsultas.filter(function(i) {
    if (i == req.query.question) {
      console.log(i + " removida de mis consultas.");
    }
    return i != req.query.question;
  });
  console.log('Mis consultas: ' + misConsultas);
});
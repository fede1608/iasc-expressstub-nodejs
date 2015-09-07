var express = require('express');
var http = require('http');
var app = express();
var colors = require('colors');
var _ = require('underscore');

var host = 'http://localhost';
var mailinglist_port = 3000;
var professor_port = process.env.PORT || 4000;
var address = make_url(host, mailinglist_port);

var Client = require('node-rest-client').Client;
var client = new Client();

var server = app.listen(professor_port, server_listening);

var questions = [];

function server_listening() {
  console.log(('A professor is online, listening on port ' + professor_port).blue);
  connect();
}

app.get('/nuevaConsulta', function(req, res) {
  var question = req.query.question;
  console.log('nueva consulta: ', question);
  enqueu_question(question);
});

app.get('/profesorRespondio', function(req, res) {
  console.log('profesor respondio: ' + req.query.question);
  questions = questions.filter(function(i) {
    if (i == req.query.question) {
      console.log(i + " removida de mis consultas.");
    }
    return i != req.query.question;
  });
});

function connect() {
  console.log('Connection in progress'.grey);
  http.get(address + '/profesorSeConecta?port=' + professor_port, listening_for_questions);
}

function enqueu_question(question) {
  questions.push(question);
}

function listening_for_questions() {
  setInterval(consume, 6000, 'You will find the meaning of life in you.');
}

function consume(answer) {
  if (questions.length > 0) {
    var question = questions.pop();
    console.log('Send new answer to mailing list on port', professor_port);
    http.get(address + '/profesorResponde?port=' + professor_port + '&question=' + question + '&answer=' + answer, answer_sent);
  }
}

function answer_sent(res) {
  console.log('The answer was sent'.green);
}

function make_url(host, port) {
  return host + ':' + port;
}
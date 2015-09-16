var express = require('express');
var http = require('http');
var app = express();
var colors = require('colors');
var _ = require('underscore');
var Promise = require('bluebird');
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
  console.log(('New question: ' + question).gray);
  enqueu_question(question);
});

app.get('/profesorResponde', function(req, res) {
  console.log(('A professor has answered: ' + req.query.question).blue);
  remove_from_questions(req.query.question);
});

app.get('/profesorEscribe', function(req, res) {
  console.log(('A professor is writing for: ' + req.query.question).cyan);
  remove_from_questions(req.query.question);
});

function remove_from_questions(question) {

  var cont = function(i){
    console.log((i + " has been removed from my questions.").cyan);
  }

  questions = questions.filter(function(i) {
    if (i == question) {
      cont(i);
    }
    return i != question;
  });
}

function connect() {
  console.log('Connection in progress'.grey);
  http.get(address + '/profesorSeConecta?port=' + professor_port, listening_for_questions);
}

function enqueu_question(question) {
  questions.push(question);
}

function consume() {
  var cont_consume = function(){
    var question = questions.pop();
    console.log('Send new answer to mailing list on port', professor_port);
    http.get(address + '/profesorEscribe?port=' + professor_port + '&question=' + question, reserve_question);
  }

  if (questions.length > 0) {
    cont_consume();
  }
}

function listening_for_questions() {
  setInterval(consume, 6000);
}

function reserve_question(res) {
  var log = "Got response: " + res.statusCode;

  var contOK = function(log, data){
    console.log((log + ", the question: " + data + " has been granted").green);
    var answer = 'You will find the meaning of life in you.';
    http.get(address + '/profesorResponde?port=' + professor_port + '&question=' + data + '&answer=' + answer, answer_sent);
  }

  var contErr = function(e){
    console.log("The question has been reserved for another professor".red);
  }

  var bad_response = function(log){
    console.log((log + ". Ups! An error happened on mailing list").red);
  }

  var response_ok = function(log){
      var resolver = Promise.pending();
      res.on("data", function(data) {
        if (data != 'already-reserved') {
          resolver.resolve(log, data);
        } else {
          resolver.reject('');
        }
      });

      return resolver.promise;
    }

  if (res.statusCode !== 200)
    bad_response(log);
  else {
    response_ok(log).then(contOK).catch(contErr);
  }
}

function answer_sent(res) {
  console.log('The answer was sent'.green);
}

function make_url(host, port) {
  return host + ':' + port;
}

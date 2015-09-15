var app = require('express')();
var client = require('http');
var server = client.Server(app);
var colors = require('colors');
var _ = require('underscore');
var address = 'http://localhost';
var util = require('util');

var Client = require('node-rest-client').Client;
client = new Client();

var students = [];
var professors = [];
var questions = []; // estructura de objeto question {id_alumno, id_profesor, question, response}

app.get('/profesorSeConecta', function(req, res) {
  addObserver(('A professor has connected ' + req.query.port).blue, professors, req.query.port, res);
  notifyAllPost(req.query.port, questions);
});

app.get('/alumnoSeConecta', function(req, res) {
  addObserver(('A student has connected, listening on ' + req.query.port).magenta, students, req.query.port, res);
});

app.get('/alumnoEscribe', function(req, res) {
  var question = {
    id_alumno: req.query.port,
    id_profesor: null,
    question: req.query.question,
    answer: null
  };
  console.log(('A student on port ' + req.query.port + ' wrote a new question: question').magenta);
  questions.push(question);
  console.log("Unaswered questions: " + util.inspect(questions, false, null));
  var stakeholders = professors.concat(students);
  notifyOneByOne("nuevaConsulta", {
    "question": question.question
  }, stakeholders);
  res.send('OK');
});

//Cuando un profesor escribe, los demas se enteran y dejan de escribir para esa consulta
app.get('/profesorEscribe', function(req, res) {

  var continuation = function(req, res, question) {
    question.id_profesor = req.query.port;

    var stakeholders = _.filter(professors, function(p) {
      return p !== req.query.port;
    });

    var contOK = function(question, stakeholders, notified){
      notifyOneByOne("profesorEscribe", {
        "question": question.question
      }, stakeholders, notified);
    }

    var notified = function() {
      console.log(("All has been notified that the professor on port " + question.id_profesor + " is writing for question: " + question.question).cyan);
    };

    if (stakeholders) {
      contOK(question, stakeholders, notified);
    }

    console.log(('A professor on port ' + req.query.port + ' is writing for: ' + req.query.question).blue);
    res.send(question.question);
  };

  validate_answer(req, res, continuation);
});

app.get('/profesorResponde', function(req, res) {

  var continuation = function(req, res, question) {

    console.log(('A professor on port ' + question.id_profesor + ' for question: ' + question.question + ', has answered: ' + req.query.answer).blue);

    questions = questions.filter(function(i) {
      return i.question != question.question;
    });
    console.log("Unaswered questions: " + util.inspect(questions, false, null));
    var everyone = students.concat(professors);
    notifyOneByOne("profesorResponde", {
      "question": question.question,
      "answer": question.answer
    }, everyone);
    res.send('OK');
  };

  validate_answer(req, res, continuation);
});

var port = 3000;
app.set('port', port);

process.on('uncaughtException', function(err) {
  console.log(err);
});

server.listen(port, function() {
  console.log(('Mailing list is online on port ' + port).green, '[', new Date().toString().yellow, ']');
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function notify_done(res) {
  console.log('Notify done', 'response code:', res);
}

function addObserver(logMessage, observers, port, res) {
  var cont = function(observers, port){
    observers.push(port);
  }

  console.log(logMessage);

  if (!_.contains(observers, port)) {
    cont(observers, port);
  }

  console.log('current observers:', observers);
  res.send('OK');
}

function make_url(host, port) { //extraer
  return host + ':' + port;
}

function validate_answer(req, res, continuation) {

  var contOK = function(question, continuation){
    var q = _.find(questions, function(elem) {
      return elem.question == question.question;
    });
    if(q){
      continuation(req, res, q);
    }else{
      res.send('already-taken');
    }
  };

  var contError = function(question){
    console.log(('A professor on port ' + question.id_profesor + ' attempted to answer an already answered/reserved question').orange);
    res.send('already-taken');
  };

  var question = {
    id_profesor: req.query.port,
    question: req.query.question,
    answer: req.query.answer
  };

  var question_found = _.find(questions, function(q) {
    return q.question == req.query.question && q.id_profesor !== null && q.id_profesor !== req.query.port;
  });

  if (question_found) {
    contError(question);
  } else {
    contOK(question, continuation);
  }
}

function notifyAllPost(port, posts) {
  var hayPosts = function (posts){
    var post = posts.pop();
    console.log('Person: ' + port + ' notified of question: ' + post.question);
    notifyOneByOne("nuevaConsulta", {
      "question": post.question
    }, [port], function() {});
    notifyAllPost(port, posts);
  }

  if (posts.length !== 0) {
    hayPosts(posts);
  }
}


function notifyOneByOne(endpoint, params, people, callWhenFinished) {
  var notificar = function (people,callWhenFinished){
    var personPort = people.pop();
    console.log('Person: ' + personPort + ' notified');
    client.get(make_url(address, personPort) + '/' + endpoint, {
      parameters: params
    }, function(data, res) {});
    notifyOneByOne(endpoint, params, people, callWhenFinished || function() {});
  }

  if (people.length === 0) {
    console.log('notifyOneByOne has callWhenFinished');
    callWhenFinished();
    return;
  } else {
    notificar(people,callWhenFinished);
  }
}

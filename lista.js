var app = require('express')();
var client = require('http');
var server = client.Server(app);
var colors = require('colors');
var _ = require('underscore');
var address = 'http://localhost';

var Client = require('node-rest-client').Client;
client = new Client();

var students = [];
var professors = [];
var questions = [];

app.get('/profesorSeConecta', function(req, res){
  addObserver(('A professor has connected ' + req.query.port).blue, professors, req.query.port, res);
  notifyAllPost(req.query.port,questions);
});

app.get('/alumnoSeConecta', function(req, res){
  addObserver(('A student has connected, listening on ' + req.query.port).magenta, students, req.query.port, res);
});

app.get('/alumnoEscribe', function(req, res){
  var question = req.query.question;
  console.log(('A student on port ' + req.query.port +' wrote a new question: question').magenta);
  questions.push(question);
  console.log("Unaswered questions: " + questions);
  var stakeholders = professors.concat(students);
  notifyOneByOne("nuevaConsulta",{ "question" : question },stakeholders)
  //for (var i = 0; i < stakeholders.length; i++){
    //endpoint_string = address+":"+stakeholders[i]+"/nuevaConsulta?question="+question, notify_done;
  	//client.get(endpoint_string);
  //};

  res.send('OK');
});

app.get('/profesorResponde', function(req, res){
  var question = req.query.question;
  var answer = req.query.answer;
  console.log(('A professor on port '+ req.query.port + ' for question: '+ question +', has answered: ' + answer).blue);
  questions = questions.filter(function(i) {
    return i != question;
  });
  console.log("Unaswered questions: " + questions);
  var everyone = students.concat(professors);
  notifyOneByOne("profesorRespondio",{ "question" : question , "answer" : answer},everyone)

	res.send('OK');
});

function notifyAllPost(port,posts){
  if (posts.length==0) return;
  var post = posts.pop();
  console.log('Person: ' + port + ' notified of question: '+post);
  notifyOneByOne("nuevaConsulta",{ "question" : post },[port],function(){
    
  });
  notifyAllPost(port,posts);
}

function notifyOneByOne(endpoint, params, people, callWhenFinished){
  if (people.length == 0) {
    console.log('notifyOneByOne has callWhenFinished')
    callWhenFinished();
    return;
  }
  var personPort = people.pop();
  console.log('Person: ' + personPort + ' notified');
  client.get(make_url(address,personPort)+'/'+endpoint, { parameters: params }, function(data,res){
    
  });

  notifyOneByOne(endpoint,params,people,callWhenFinished || function(){});
}

var port = 3000;
app.set('port', port);

process.on('uncaughtException', function (err) {
    console.log(err);
});

server.listen(port, function(){
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

function notify_done(res){
  console.log('Notify done', 'response code:', res);
}

function addObserver(logMessage, observers, port, res){
  console.log(logMessage);
  if(!_.contains(observers, port)){
    observers.push(port);
  }
  console.log('current observers:', observers);
  res.send('OK');
}

function make_url(host, port){//extraer
  return host + ':' + port;
}

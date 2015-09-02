var app = require('express')();
var http = require('http').Server(app);
var colors = require('colors');
var client = require('http');
var _ = require('underscore');
var address = "http://localhost";

var students = [];
var professors = [];
var posts = [];

//unirest
app.get('/', function(req, res){
  res.send('Hello');
});

app.get('/profesorSeConecta', function(req, res){
  addObserver(('A professor has connected' + req.query.port).blue, professors, req.query.port, res);
});

app.get('/alumnoSeConecta', function(req, res){
  addObserver(('A student has connected, listening on ' + req.query.port).magenta, students, req.query.port, res);
});

app.get('/alumnoEscribe', function(req, res){
  console.log(('A student on port ' + req.query.port +' is writing').magenta);
  var consulta = req.query.consulta;//Consulta(data, alumno);
  var stakeholders = professors.concat(students);

  for (stakeholder in stakeholders){
  	client.get(address+":"+stakeholder+"/nuevaConsulta?consulta="+consulta, notify_done);
  };

  res.send('OK');
});

app.get('/profesorResponde', function(data){
  console.log('un profesor responde');
	res.send('OK');
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

http.listen(port, function(){
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

function notify_done(port){
  console.log('Notify done');
}

function addObserver(logMessage, observers, port, res){
  console.log(logMessage);
  if(!_.contains(observers, port)){
    observers.push(port);
  }
  console.log('current observers:', observers);
  res.send('OK');
}

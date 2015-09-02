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

function addObserver(logMessage, observers, port, res){
  console.log(logMessage);
  if(!_.contains(observers, port)){
    observers.push(port);
  }
  console.log('current observers:', observers);
  res.send('OK');
}

app.get('/alumnoEscribe', function(req, res){
  console.log('a alumno escribe');
  console.log(req.query);
  var consulta = req.query.consulta;//Consulta(data, alumno);
  for (profesor in professors){
  	//client.get(address+":"+profesor+"/nuevaConsulta?consulta="+consulta,function(){

  	//});
  };
  for (student in students){
  	//client.get(address+":"+alumno+"/nuevaConsulta?consulta="+consulta,function(){

  	//});
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
var app = require('express')();
var http = require('http').Server(app);

var client = require('http');
var address = "http://localhost"

var alumnos = [];
var profesores = [];

var consultas = [];


app.get('/', function(req, res){
  res.send('Hello');
});

app.get('/profesorSeConecta', function(req, res){
  console.log('Un profesor se conecta');
  console.log('Port: ' + req.query.port)
  profesores.push(req.query.port);
	res.send('OK');
});

app.get('/alumnoSeConecta', function(req, res){
  	console.log('un alumno se conecta');
    console.log('Port: ' + req.query.port);
    alumnos.push(req.query.port);
	res.send('OK');
});

app.get('/alumnoEscribe', function(req, res){
  console.log('a alumno escribe');
  console.log(req.query);
  var consulta = req.query.consulta;//Consulta(data, alumno);
  for (profesor in profesores){
  	client.get(address+":"+profesor+"/nuevaConsulta?consulta="+consulta,function(){

  	});
  };
  for (alumno in alumnos){
  	client.get(address+":"+alumno+"/nuevaConsulta?consulta="+consulta,function(){

  	});
  };
res.send('OK');
});

app.get('/profesorResponde', function(data){
  console.log('un profesor responde');
	res.send('OK');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
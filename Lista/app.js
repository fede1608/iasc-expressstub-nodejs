var app = require('express')();
var http = require('http').Server(app);

var alumnos = [];
var profesores = [];

var consultas = [];


app.get('/', function(req, res){
  res.send('Hello');
});

app.get('/profesorSeConecta', function(req, res){
  console.log('an profesor se conecta');
	res.send('OK');
});

app.get('/alumnoSeConecta', function(req, res){
  console.log('un alumno se conecta');
	res.send('OK');
});

app.get('/alumnoEscribe', function(req, res){
  console.log('a alumno escribe');
  console.log(data);
  var consulta = Consulta(data, alumno);
  for (profesor in profesores){
  	profesor.socket.emit('nuevaConsulta', consulta);
  };
  for (alumno in alumnos){
  	alumno.socket.emit('nuevaConsulta', consulta);
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
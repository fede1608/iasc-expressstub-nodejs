var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var alumnos = [];
var profesores = [];

var consultas = [];


app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('profesorSeConecta', function(data){
  console.log('an profesor se conecta');
	
});

io.on('alumnoSeConecta', function(data){
  console.log('a alumno se conecta');
	
});

io.on('alumnoEscribe', function(data){
  console.log('a alumno escribe');
  console.log(data);
  var consulta = Consulta(data, alumno);
  for (profesor in profesores){
  	profesor.socket.emit('nuevaConsulta', consulta);
  };
  for (alumno in alumnos){
  	alumno.socket.emit('nuevaConsulta', consulta);
  };

});

io.on('profesorResponde', function(data){
  console.log('a alumno se conecta');
	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
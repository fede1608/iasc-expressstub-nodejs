var app = require('express')();
var http = require('http').Server(app);

var alumnos = [];
var profesores = [];

var consultas = [];


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/profesorSeConecta', function(data){
  console.log('an profesor se conecta');
	
});

app.get('/alumnoSeConecta', function(data){
  console.log('a alumno se conecta');
	
});

app.get('/alumnoEscribe', function(data){
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

app.get('/profesorResponde', function(data){
  console.log('a alumno se conecta');
	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
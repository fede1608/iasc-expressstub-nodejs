var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('profesorSeConecta', function(socket){
  console.log('an alumno se conecta');
	
});

io.on('alumnoSeConecta', function(socket){
  console.log('a profesor se conecta');
	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
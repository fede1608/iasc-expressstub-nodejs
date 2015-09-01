var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io-client');

    //#1 Declaramos el objeto socket que se conectará en este caso a localhost
    var socket = io.connect('127.0.0.1', {
    port: 3000
});
	socket.emit('profesorSeConecta'); 

 
//    //#3 Si estamos conectados, muestra el log y cambia el mensaje
//    socket.on('connected', function () {
//      console.log('Conectado!');
//      
//      });
 


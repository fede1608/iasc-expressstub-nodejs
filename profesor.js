var express = require('express');
var app = express();
var http = require('http').Server(app);


http.get("http://localhost:3000/profesorSeConecta", function(res) {
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});











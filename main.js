//count players
var numPlayers = 0;

//load libraries
var http = require('http');
var fs = require('fs');
 
//send html page to client
var app = http.createServer(function (request, response) {
	fs.readFile("client.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(process.env.PORT || 5000);

//message to tell us the server has started
console.log("server started at " + app.address().address + " " + app.address().port);
 
//start socket
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
	socket.on('message_to_server', function(data) {
		console.log("new message: " + data["x"] + "," + data["y"] + "," + data["tone"]);
		io.sockets.emit("message_to_client", data);
	});
});

io.sockets.on('connect', function(socket) { 
	numPlayers++; 
	console.log("players " + numPlayers); 
	io.sockets.emit("player_num_change", {num: numPlayers});

	socket.on('disconnect', function () {
		numPlayers--; 
		console.log("players " + numPlayers); 
		io.sockets.emit("player_num_change", {num: numPlayers});
    });
});
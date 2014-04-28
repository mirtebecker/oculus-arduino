var fs = require('fs');
var url = require('url');
var io = require('socket.io');
/* Create the server in the port 8080 */
var http = require('http').createServer(function (req, res) {
	var request = url.parse(req.url, false);
	var filename = request.pathname;
	if (filename == "/") filename = "/index.html";
	/* Append the frontend folder */
	filename = 'frontend' + filename;
	fs.readFile(filename, function (err, data) {
		/* Any error on reading the file? */
		if (err) {
			if (err.errno == 34) // File not found
				res.writeHead(404);
			else res.writeHead(500);
			res.end();
			return;
		}
		res.writeHead(200);
		res.write(data);
		res.end();
	});
}).listen(8080);
var socketServer = io.listen(http);
socketServer.set('log level', 1);
socketServer.sockets.on("connection", function (socket) {
	// On a new Socket.io connection, load the data provider we want. For now, just Arduino.
	// var $provider = require('./providers/arduino.js').init(socket);
	socket.emit('news', {
		hello: 'world'
	});
});
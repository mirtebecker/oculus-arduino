var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var net = require('net');
var sensorData;
var message = {
  "data": ''
}
var newValue,
  oldValue,
  diff;
//Settings
var HTTP_PORT = 9000;
var NET_PORT = 9001;
var WS_PORT = 9002;
//Server
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};
var proxy = http.createServer(function (req, res) {
  var fileToLoad;
  if (req.url == '/') {
    fileToLoad = 'index.html';
  } else {
    fileToLoad = url.parse(req.url).pathname.substr(1);
  }
  // req.on("end", function () {
  //   console.log("Connection has ended");
  // });
  // req.on("close", function () {
  // });
  console.log('[HTTP] :: Loading :: ' + 'frontend/' + fileToLoad);
  var fileBytes;
  var httpStatusCode = 200;
  fs.exists('frontend/' + fileToLoad, function (doesItExist) {
    if (!doesItExist) {
      console.log('[HTTP] :: Error loading :: ' + 'frontend/' + fileToLoad);
      httpStatusCode = 404;
    }
    var fileBytes = fs.readFileSync('frontend/' + fileToLoad);
    var mimeType = mimeTypes[path.extname(fileToLoad).split('.')[1]];
    res.writeHead(httpStatusCode, {
      'Content-type': mimeType
    });
    res.end(fileBytes);
  });
  // console.log("[INIT] Server running on HTTP Port");
}).listen(HTTP_PORT);

proxy.on("close", function(){
  console.log("Connection has closed");
});

proxy.on("end", function(){
  console.log("Connection has ended");
});
var socket;
var clients = [];
var server = net.createServer(function (socket) {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  clients.push(socket);
  socket.write("HTTP/1.1 101", function () {
    console.log('[CONN] New connection: ' + socket.name + ', total clients: ' + clients.length);
  });
  socket.setEncoding('utf8');
  socket.on('error', function (data) {
    console.log(data);
  });
  socket.on('end', function () {
    console.log('[END] Disconnection: ' + socket.name + ', total clients: ' + clients.length);
  });
  socket.on('data', function (data) {
    console.log('[RECV from ' + socket.remoteAddress + "] " + data);
    oldValue = newValue;
    newValue = data;
    diff = Math.abs(newValue) - Math.abs(oldValue);
    console.log(Math.abs(newValue) + '-' + Math.abs(oldValue));
    message.data = Math.abs(diff);
    console.log('[SAVED] ' + message.data);
  });
});
server.listen(NET_PORT, function () {
  console.log("[INIT] Server running on NET server port", NET_PORT);
});
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: WS_PORT
  });
wss.on('connection', function (ws) {
  // ws.send(JSON.stringify(message));
  setInterval(function () {
    updateXData(ws)
  }, 500);
});

function updateXData(ws) {
  var newMessage = {
    "data": ""
  }
  newMessage.data = message.data
  ws.send(JSON.stringify(newMessage));
}
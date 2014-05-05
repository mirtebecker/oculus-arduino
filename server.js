var net = require('net');
var socket;
 
var server = net.createServer(function(socket) {
  socket.setEncoding('utf8');
  
  socket.on('connect', function() {
    console.log(">>> received CONNECT");
    console.log('WiFly connected with ip adress: ' + socket.remoteAddress);
  });
  
  socket.on('error', function(data){
    console.log("[EROR]");
    console.log(data);
  });

  socket.on('end', function() {
    console.log('Disconnected');
  });

  // socket.connect('connect', function(data){
  //   console.log(">>> received CONNECT");
  //   console.log("data: "+ data);
  // })

  socket.on('data', function(data) {
    console.log(">>> received DATA!");
    console.log(socket.remoteAddress + " sends: " + data);
    socket.write("HTTP/1.1 101", function(data){
      console.log("something: "+data);
    });
  });
});
 
server.listen(9001, function() { //'listening' listener
  console.log('start WiFly test server...');
});
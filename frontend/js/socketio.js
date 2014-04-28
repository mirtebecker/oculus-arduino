jQuery(document).ready(function () {
	var socket = io.connect("/", {
		"reconnect": true,
		"reconnection delay": 500,
		"max reconnection attempts": 10
	});
	socket.on("message", function (data) {
		//data = process_data(data); /* Initialize position */
		console.log(data);
	});
	socket.on('news', function (data) {
		// console.log(data);
		Config.gForce = data;
		// console.log(Config.gForce);
	});
});
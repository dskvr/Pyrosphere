
/**
 * Module dependencies.
 */


var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
	, serial = require("serialport").SerialPort
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);
	

var app = express()
  // , routes = require('./routes')
	// , user = require('./routes/user')
	// , http = require('http')
	// , path = require('path')
	// , io = require('socket.io').listen(server);


app.configure(function(){
  // app.use(require('stylus').middleware(__dirname + '../Pyromote'));
  app.use(express.static(path.join(__dirname, '../Pyromote')));
	app.set('port', 8080);
});

app.configure('development', function(){
  // app.use(app.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("app server listening on port " + app.get('port'));
});

var serial = new serial("/dev/tty.usbmodem1411", {
  baudrate: 115200
});

var serialReady = false;

var number = 100;
var increment = 1;

var numberMax = 100;
var numberMin = 10;


io.on('connection',function(socket){
	
	socket.on('pyro.pipe', function(request){
		console.log('pyro.pipe?');
		console.log(request);
		serial.write(request);
	});
	
});


serial.on("open", function () {
	
  console.log('open');

  serial.on('data', function(data) {
    console.log('data received: ' + data);
  });
  
  serial.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
	// 
	// setTimeout(function(){
	// 	setInterval(function () {
	// 		// if(!serialReady) return;
	// 		if(number <= numberMin || number >= numberMax) { increment = increment*-1 }
	// 		number += increment;
	// 	  serial.write('@'+number+'.#'+number+'.');
	// 		// console.log('Sending: @'+number+'.#'+number+'.');
	// 
	// 	}, 10);
	// }, 5000);
	

});

server.listen(3000);
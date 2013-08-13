// SERVER AND SOCKETS
var app = require('express')()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);


io.set('loglevel',10) // set log level to get all debug messages

io.on('connection',function(socket){

  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });

	socket.on('pyro.mode', function(mode){
		mode = '~' + mode + '.';
		serial.write(mode, function(){
			//callback
		});
	});

	socket.on('pyro.set', function(request){
		var _request = '';
		if(request.pattern) _request += '!'+request.pattern+'.';
		if(request.duration) _request += '@'+request.duration+'.';
		if(request.interval) _request += '#'+request.interval+'.';
		if(request.progressionMultiplier) _request += '#'+request.interval+'.';
		serial.write(_request, function(){
			//callback
		});
	});
	
	socket.on('pyro.pipe', function(request){
		
		serial.write(request, function(){
			console.log('Requesr sent to Sphere.');
			console.log(request);
		});
		
	});
})

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/',function(req,res){
  res.render('index.html');
});

var SerialPort = require("serialport").SerialPort;
var serial = new SerialPort("/dev/tty.usbmodem1411", {
  baudrate: 115200
});

// Routes

// app.get('/', routes.index);
// app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
// app.get('*', routes.index);

// Socket.io Communication
// Start server
var serialReady = false;

var number = 100;
var increment = 1;

var numberMax = 100;
var numberMin = 10;

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


var userNames = (function () {
	
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };
  
  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

	// var name = userNames.getGuestName();

	// send the new user their name and a list of users
	// socket.emit('init', {
	// 	  name: name,
	// 	  users: userNames.get()
	// 	});



	
	// io.listen(8080, function(){
	// 	console.log('Socket Listening');
	// });




io.sockets.on('connection',function(socket){ 
	
		var clients = io.sockets.clients();
		var total = clients.length;
	
    io.sockets.sockets['nickname'] = socket.id;
		io.sockets.sockets['key'] = Math.round(Math.random*Math.random/Math.random)*9999999;
		
		if(total == 1) socket.set('sessionController', socket.id, function(){
			
		})
		
		socket.emit('session.start', {
			
		})
		
    client.on("pipe", function(data) {      
	
        var sock_id = io.sockets.sockets['nickname'];
				var active_id = socket.get('sessionController'); //This is the ID that has control over the Sphere.
				if(active_id != sock_id) io.sockets.sockets[sock_id].emit("session", { key  : false } );
				// else serial.send(data.req);
				// else io.sockets.sockets[sock_id].emit("private", "message");     

    });

});
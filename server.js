/*var express = require('express'),
app = express();
var port = 3700;

//app.set('view engine', require('jade'));
//app.engine('html', require('jade'));
//app.set('views', __dirname + '/');

//app.use(express.static(__dirname + '/public'));

app.get("/hello", function(req, res){
//res.status(200).render("index");
res.send('Hello world');
});

app.listen(port);
console.log("Listening on port " + port);*/

// Simplest HTTP server
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'public')));

io.on('connection', function (socket) {
    
    socket.on('quote', function (symbol) {
        
        var payload = JSON.stringify({
            start : 0,
            limit : 1,
            query : symbol
        });
        
        var options = {
            hostname: 'www.pse.com.ph',
            port: 80,
            path: '/stockMarket/home.html?method=findSecurityOrCompany&ajax=true',
            method: 'POST'
        };

        var request = http.request(options, function(res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (data) {
                console.log('BODY: ' + data);
                socket.emit('quote', data);
            });
        });
        
        request.write(payload);
        request.end();
    });
    
});

var port = 1337;

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});
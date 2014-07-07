var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var qs = require('qs');

router.use(express.static(path.resolve(__dirname, 'public')));

io.on('connection', function (socket) {
    
    socket.on('quote', function (symbol) {
        
        var payload = qs.stringify({
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
        
        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        
        request.write(payload);
        request.end();
    });
    
});

var port = 1337;

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});
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
        var stockInfo = retrieveStockInfo(symbol);
        console.log(stockInfo);
        socket.emit('stockInfo', stockInfo);
        
        //retrieveQuote(stockInfo.listedCompany_companyId, stockInfo.securityId);
    });
    
});

function retrieveStockInfo(symbol) {
    var payload = qs.stringify({
        start : 0,
        limit : 1,
        query : symbol
    });

    var options = {
        host: 'www.pse.com.ph',
        port: 80,
        path: '/stockMarket/home.html?method=findSecurityOrCompany&ajax=true',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    var request = http.request(options, function(res) {
        
        var data = "";
        
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        
        res.on('end', function () {
            var dataJson = JSON.parse(data);
            var stockInfo = dataJson.records[0];
            socket.emit('stockInfo', stockInfo);
            return stockInfo;
        });
    });

    request.write(payload);
    request.end();
}

function retrieveQuote(listedCompanyId, securityId) {
    var payload = qs.stringify({
        company : listedCompanyId,
        security : securityId
    });

    var options = {
        host: 'www.pse.com.ph',
        port: 80,
        path: '/stockMarket/companyInfo.html?method=fetchHeaderData&ajax=true',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    var request = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            console.log('BODY: ' + data);
            
            socket.emit('quote', data.records[0]);
        });
    });

    request.write(payload);
    request.end();
}

var port = 1337;

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});
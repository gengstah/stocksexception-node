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

var sockets = [];
var clients = [];

io.on('connection', function (socket) {
    
    sockets.push(socket);
    clients.push('');
    
    socket.on('disconnect', function () {
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
        clients.splice(index, 1);
    });
    
    socket.on('quote', function (symbol) {
        var index = sockets.indexOf(socket);
        clients[index] = symbol;
        retrieveStockInfo(symbol, function (stockInfo) {
            retrieveQuote(stockInfo.listedCompany_companyId, stockInfo.securityId, function (quote) {
                console.log({ "stockInfo" : stockInfo, "quote" : quote });
                socket.emit('quote', { "stockInfo" : stockInfo, "quote" : quote });
            });
        });
    });
    
});

setInterval(updateQuotations, 10000);

function updateQuotations() {
    
    console.log("updating all quotations");
    var caches = [];
    sockets.forEach(function (socket) {
        
        var socketIndex = sockets.indexOf(socket);
        var symbol = clients[socketIndex];
        
        if(symbol) {
            caches.forEach(function (cache) {
                if(cache.symbol == symbol) {
                    var cacheIndex = caches.indexOf(cache);
                    console.log("Sending data from cache");
                    socket.emit('quote', { "stockInfo" : caches[cacheIndex].stockInfo, "quote" : caches[cacheIndex].quote });
                    return;
                }
            });

            retrieveStockInfo(symbol, function (stockInfo) {
                retrieveQuote(stockInfo.listedCompany_companyId, stockInfo.securityId, function (quote) {
                    console.log({ "stockInfo" : stockInfo, "quote" : quote });
                    caches.push({ "symbol" : symbol, "stockInfo" : stockInfo , "quote" : quote });
                    socket.emit('quote', { "stockInfo" : stockInfo, "quote" : quote });
                });
            });
        }
        
    });
    
}

function retrieveStockInfo(symbol, fn) {
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
            
            fn(stockInfo);
        });
    });

    request.write(payload);
    request.end();
}

function retrieveQuote(listedCompanyId, securityId, fn) {
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
        var data = "";
        
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        
        res.on('end', function () {
            var dataJson = JSON.parse(data);
            var quote = dataJson.records[0];
            
            fn(quote);
        });
    });

    request.write(payload);
    request.end();
}

var port = 1337;

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});
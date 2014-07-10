var stocksExceptionApp = angular.module('stocksExceptionApp', []);

function StocksController($scope) {
    
    var socket = io.connect();
    
    $("#lastTradePriceValue").tooltip({
		placement : 'auto top'
	});
    
    socket.on('quote', function (data) {
        
        formatTradePrices(data);
        $scope.stocks = data;
        $scope.quoteDate = new Date();
        
        //$scope.securityName = data.stockInfo.securityName;
        //$scope.lastTradePriceValue = numberWithCommasAndDecimal(data.quote.headerLastTradePrice);
        
        $scope.$apply();
        $("#btnSubmit").button('reset');
        $("#stockInformation").removeClass("hidden");
        
    });
    
    $scope.quote = function quote() {
        
        $("#btnSubmit").button('loading');
        socket.emit('quote', $scope.symbol);
        
    }
    
}

function formatTradePrices(data) {
    data.quote.headerLastTradePrice = numberWithCommasAndDecimal(data.quote.headerLastTradePrice);
    data.quote.headerTotalValue = numberWithCommas(data.quote.headerTotalValue);
    data.quote.headerTotalVolume = numberWithCommas(data.quote.headerTotalVolume);
    data.quote.headerFiftyTwoWeekLow = numberWithCommasAndDecimal(data.quote.headerFiftyTwoWeekLow);
    data.quote.headerFiftyTwoWeekHigh = numberWithCommasAndDecimal(data.quote.headerFiftyTwoWeekHigh);
    data.quote.headerChangeClose = numberWithCommasAndDecimal(data.quote.headerChangeClose);
    data.quote.headerPercChangeClose = numberWithCommasAndDecimal(data.quote.headerPercChangeClose);
    data.quote.headerSqHigh = numberWithCommasAndDecimal(data.quote.headerSqHigh);
    data.quote.headerSqOpen = numberWithCommasAndDecimal(data.quote.headerSqOpen);
    data.quote.headerSqLow = numberWithCommasAndDecimal(data.quote.headerSqLow);
    data.quote.headerSqPrevious = numberWithCommasAndDecimal(data.quote.headerSqPrevious);
    data.quote.headerAvgPrice = numberWithCommasAndDecimal(data.quote.headerAvgPrice);
}

function numberWithCommas(number) {
    /*var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");*/
    return number.split(".")[0];
}

function numberWithCommasAndDecimal(number) {
	number = parseFloat(Math.round(number * 100) / 100).toFixed(2);
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
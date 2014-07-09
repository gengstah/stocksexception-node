var stocksExceptionApp = angular.module('stocksExceptionApp', []);

function StocksController($scope) {
    
    var socket = io.connect();
    
    $("#lastTradePriceValue").tooltip({
		placement : 'auto top'
	});
    
    socket.on('quote', function (data) {
        
        $scope.securityName = data.stockInfo.securityName;
        $scope.quoteDate = new Date();
        $scope.$apply();
        $("#btnSubmit").button('reset');
        $("#stockInformation").removeClass("hidden");
        
    });
    
    $scope.quote = function quote() {
        
        $("#btnSubmit").button('loading');
        /*$http.get('http://www.pse.com.ph/stockMarket/home.html?method=getSecuritiesAndIndicesForPublic&ajax=true').
            success(function(data) {
                console.log(data);
                $scope.companyName = 'geng';
                $("#btnSubmit").button('reset');
            });*/
        socket.emit('quote', $scope.symbol);
        
    }
    
}
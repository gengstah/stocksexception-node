var stocksExceptionApp = angular.module('stocksExceptionApp', []);

function StocksController($scope) {
    
    var socket = io.connect();
    
    socket.on('quote', function (data) {
        
        $scope.stocks = data;
        $scope.$apply();
        
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
        $("#btnSubmit").button('reset');
        
    }
    
}
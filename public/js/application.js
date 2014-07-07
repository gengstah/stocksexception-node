$(document).ready(function(){
	$('body').scrollspy({ target: '#affixElement' });
	$('#affixElement').affix({
		offset: {
			top: 100,
			bottom: function () {
				return (this.bottom = $('footer').outerHeight(true));
			}
		}
	});
	
	$('input#symbol').focus();
	$("#lastTradePriceValue").tooltip({
		placement : 'auto top'
	});
	/*$('#formChart').submit(function(event) {
		$("#btnSubmit").button('loading');
		
		$.getJSON('retrieveCompanyStockInfoRecord?symbol='+ $('input#symbol').val().toUpperCase(), function(data) {
			if($.isEmptyObject(data)) {
				$("#stockInformation").addClass("hidden");
				$('[data-spy="scroll"]').each(function () {
					var $spy = $(this).scrollspy('refresh')
				});
			} else {
				if(data.headerChangeClose < 0) {
					$("#lastTradePriceValue").html('<span class="label label-danger">' + numberWithCommasAndDecimal(data.headerLastTradePrice) + '</span>');
					$("#changeValue").html('<span class="label label-danger">' + numberWithCommasAndDecimal(data.headerChangeClose) + '</span>');
					$("#percentChangeValue").html('<span class="label label-danger">' + numberWithCommasAndDecimal(data.headerPercChangeClose) + '%</span>');
				} else if(data.headerChangeClose > 0) {
					$("#lastTradePriceValue").html('<span class="label label-success">' + numberWithCommasAndDecimal(data.headerLastTradePrice) + '</span>');
					$("#changeValue").html('<span class="label label-success">' + numberWithCommasAndDecimal(data.headerChangeClose) + '</span>');
					$("#percentChangeValue").html('<span class="label label-success">' + numberWithCommasAndDecimal(data.headerPercChangeClose) + '</span>');
				} else {
					$("#lastTradePriceValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerLastTradePrice) + '</span>');
					$("#changeValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerChangeClose) + '</span>');
					$("#percentChangeValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerPercChangeClose) + '</span>');
				}
				
				$("#totalValue").html('<span class="label label-default">' + numberWithCommas(data.headerTotalValue) + '</span>');
				$("#totalVolume").html('<span class="label label-default">' + numberWithCommas(data.headerTotalVolume) + '</span>');
				$("#fiftytwoweekValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerFiftyTwoWeekLow) + ' ~ ' + numberWithCommasAndDecimal(data.headerFiftyTwoWeekHigh) + '</span>');
				$("#priceOpenValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerSqOpen) + '</span>');
				$("#priceHighValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerSqHigh) + '</span>');
				$("#priceLowValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerSqLow) + '</span>');
				$("#pricePreviousValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerSqPrevious) + '</span>');
				$("#averagePriceValue").html('<span class="label label-default">' + numberWithCommasAndDecimal(data.headerAvgPrice) + '</span>');
				$("#stockInformation").removeClass("hidden");
			}
		});
		
		$.getJSON('stockRecordInfo?symbol=' + $('input#symbol').val().toUpperCase(), function(data) {
			if($.isEmptyObject(data)) {
				$("#historicalData").addClass("hidden");
				$("#intradayData").addClass("hidden");
				$("#historicalCandleStickData").addClass("hidden");
				$("#btnSubmit").button('reset');
			} else {
				
				$("#stockNameInfo").html('<h3>' + data.symbol + ' <span class="text-muted">' + data.securityName + '</span></h3><small>As of ' + getDateWithAsiaTimezone() +  '</small>');
				singleLineSeries(data);
				singleLineSeriesIntraday(data);
				candleStick(data);
				$('input#symbol').val('');
				$("#btnSubmit").button('reset');
			}
		});
		
		event.preventDefault();
	});
	
	$("#formChartCompare").submit(function(event) {
		$("#btnCompare").button('loading');
		
		intradayStockComparison();
		
		event.preventDefault();
	});
});*/

function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function numberWithCommasAndDecimal(number) {
	number = parseFloat(Math.round(number * 100) / 100).toFixed(2);
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getDateWithAsiaTimezone() {
	var date = new Date();
	var localTime = date.getTime();
	var localOffset = date.getTimezoneOffset() * 60000;
	var utc = localTime + localOffset;
	var offset = 8;
	var asia = utc + (3600000 * offset);
	return new Date(asia).toLocaleString();
}

function singleLineSeries(stockInfo) {
	$.getJSON('singleLineSeries?symbol=' + $('input#symbol').val().toUpperCase(), function(data) {
		$("#historicalData").removeClass("hidden");
		$('#singleLineSeries').highcharts('StockChart', {
			
			rangeSelector : {
				selected : 1,
				inputEnabled: $('#singleLineSeries').width() > 480
			},
			
			credits : {
				href : "http://www.geeksexception.com",
				text : "GeeksException"
			},
	
			title : {
				text : stockInfo.securityName
			},
			
			series : [{
				name : stockInfo.symbol,
				data : data,
				tooltip: {
					valueDecimals: 2
				}
			}]
		});
	});
}

function singleLineSeriesIntraday(stockInfo) {
	$.getJSON('singleLineSeriesIntraday?symbol=' + $('input#symbol').val().toUpperCase(), function(data) {
		$("#intradayData").removeClass("hidden");
		$('#singleLineSeriesIntraday').highcharts('StockChart', {
			
			rangeSelector : {
				selected : 1,
				inputEnabled: $('#singleLineSeriesIntraday').width() > 480
			},
			
			credits : {
				href : "http://www.geeksexception.com",
				text : "GeeksException"
			},
	
			title : {
				text : stockInfo.securityName
			},
			
			series : [{
				name : stockInfo.symbol,
				data : data,
				tooltip: {
					valueDecimals: 2
				}
			}]
		});
	});
}

function candleStick(stockInfo) {
	$.getJSON('candleStick?symbol=' + $('input#symbol').val().toUpperCase(), function(data) {
		$("#historicalCandleStickData").removeClass("hidden");
		var ohlc = [], volume = [], dataLength = data.length;
		
		for (i = 0; i < dataLength; i++) {
			ohlc.push([
				data[i][0], // the date
				data[i][1], // open
				data[i][2], // high
				data[i][3], // low
				data[i][4] // close
			]);
			
			volume.push([
				data[i][0], // the date
				data[i][5] // the volume
			])
		}
		
		var groupingUnits = [[
			'week',                         // unit name
			[1]                             // allowed multiples
		], [
			'month',
			[1, 2, 3, 4, 6]
		]];
		
		$('#candleStick').highcharts('StockChart', {
		    
		    rangeSelector: {
				inputEnabled: $('#candleStick').width() > 480,
		        selected: 1
		    },
			
			credits : {
				href : "http://www.geeksexception.com",
				text : "GeeksException"
			},

		    title: {
		        text: stockInfo.securityName
		    },

		    yAxis: [{
		        title: {
		            text: 'OHLC'
		        },
		        height: 160,
		        lineWidth: 2
		    }, {
		        title: {
		            text: 'Volume'
		        },
		        top: 248,
		        height: 60,
		        offset: 0,
		        lineWidth: 2
		    }],
		    
		    series: [{
		        type: 'candlestick',
		        name: stockInfo.symbol,
		        data: ohlc,
		        dataGrouping: {
					units: groupingUnits
		        }
		    }, {
		        type: 'column',
		        name: 'Volume',
		        data: volume,
		        yAxis: 1,
		        dataGrouping: {
					units: groupingUnits
		        }
		    }]
		});
		
		$('[data-spy="scroll"]').each(function () {
			var $spy = $(this).scrollspy('refresh')
		});
	});
}

function intradayStockComparison() {
	var seriesOptions = [],
		yAxisOptions = [],
		seriesCounter = 0,
		names = [$("#symbol1").val(),$("#symbol2").val(),$("#symbol3").val(),$("#symbol4").val()],
		colors = Highcharts.getOptions().colors;
	$.each(names, function(i, name) {
		name = name.toUpperCase();
		$.getJSON('singleLineSeriesIntraday?symbol=' + name, function(data) {
			//$("#intradayStockComparison").removeClass("hidden");
			seriesOptions[i] = {
				name: name,
				data: data
			};
			seriesCounter++;
			if (seriesCounter == names.length) {
				$('#stockComparison').highcharts('StockChart', {
					
					rangeSelector : {
						selected : 1,
						inputEnabled: $('#stockComparison').width() > 480
					},
					
					yAxis: {
						labels: {
							formatter: function() {
								return (this.value > 0 ? '+' : '') + this.value + '%';
							}
						},
						plotLines: [{
							value: 0,
							width: 2,
							color: 'silver'
						}]
					},
					
					plotOptions: {
						series: {
							compare: 'percent'
						}
					},
					
					credits : {
						href : "http://www.geeksexception.com",
						text : "GeeksException"
					},
			
					title : {
						text : 'Stocks price comparison'
					},
					
					tooltip: {
						pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
						valueDecimals: 2
					},
					
					series : seriesOptions
				});
				
				$("#btnCompare").button('reset');
			}
		});
	});
}

Highcharts.theme = {
   global: {
	   timezoneOffset: -8 * 60
   }
};

var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
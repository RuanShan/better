var g_quotation_desc = {
    first_pass: true,
    symbols: {},
    fields: {},
    req_fields: {},
    symbol_data: [],
    charts: {},
    labels: {},
    panels: {}
};

var g_expiry = {


};

$(function(){
  //function getGameType(){
  //  return parseInt( $(".game-type.active").data('game-type') );
  //}

  if($(".expiry-panel").is('*')){
    $(".game-type").click(function(){
      var $this = $(this);
      $(".game-type").removeClass("active");
      $(this).addClass("active");
      var id = this.id;
      $(this).parent().siblings().hide();
      $(this).parent().siblings('.'+id).show();

    });

    $(".b-expiry-in").click(function(){
      var $this = $(this);

      $(".b-current-expiry-in").html($this.html()).data( {"expiry-in": $this.data("expiry-in")});
      var i = parseInt( $this.data("expiry-in") );
      var txt = "";

    });

  }

  $(".b-game-round-start-at").each( function(){
    var $this = $(this);
    $game_start_at_countdown = $(".b-game-round-open-countdown");
    $this.countdown( moment().toDate(), moment().add(1, 'days').toDate(), function(event){
      var $current_expiry_in = $(".b-current-expiry-in");
      var $game_expiry_box = $("#game-expiry-box");
      var expiry_in = parseInt( $current_expiry_in.data("expiry-in") );

      var game_type_id = 1;
        var timeFormat = "%d day(s) %h小时%m分%s秒";
        switch(event.type) {
          case "days":
            break;
          case "hours":
            break;
          case "minutes":
            var mins = moment().minutes();
            $game_expiry_box.empty();
            var remainder= mins%5 // start a agme round in each 5 mins
            for(var i=0;i < 60/5; i++){
              var time = moment().subtract(remainder, "minutes").add((i+1)*5,"minutes");
              var today = (time.day() == moment().day()) ? "今天" : "明天";
              $game_expiry_box.append("<option value='"+time.unix()+"'>"+ today +time.format("hh:mm")+"</option>")
            }
            break;
          case "seconds":
            var now = moment()
            var game_start_at = moment().add(1, "minutes");
            // 300 open in every 2mins
            var left_mins = now.mintues()%2;
            if( expiry_in == 300 ){
              $this.html(moment().add(left_mins, "minutes").format("hh:mm"));
            }else{
              $this.html(moment().add(1, "minutes").format("hh:mm"));
            }
            //设置游戏投注倒计时
            if( expiry_in== 30){
              if( event.value < 30 )
              {
                $game_start_at_countdown.html( moment().seconds(event.value).format("00:ss") );
              }else{
                $game_start_at_countdown.html( "");
              }
            }else{
              $game_start_at_countdown.html(  moment().seconds(event.value).format("00:ss") );
            }
            break;
          case "finished":
            break;
        }

    });
  })


})


// bid  count down
$("#better-countdown").each( function(){
   var $this = $(this);
   var local_now = new Date( );
   var local_offset=local_now.getTimezoneOffset()*60000;
   var now = new Date( $this.data('now'));
   var end = new Date( $this.data('end'));
   var d, h, m, s;

   $this.countdown( now, end, function(event){
     var timeFormat = "%d day(s) %h小时%m分%s秒";
     switch(event.type) {
       case "days":
         break;
       case "hours":
         break;
       case "minutes":

         break;
       case "seconds":
         //$this.find(".J_TimeLeft").replaceWith(
        //    _.template( $("#j_datetime_left").html(), {variable: 'lasting'})(event.lasting));
         break;
       case "finished":
         break;
     }
   });
 });



function format_intval(v, digits) {
    var txt = "";

    if (digits > 0) {
        var pow = Math.pow(10, digits);

        if (v < pow && v > -pow) {
            if (v < 0) { txt = "-0."; v = -v; }
            else { txt = "0."; }
            var tmp = "" + v;
            for (var i = tmp.length; i < digits; i++) txt += "0";
            txt += tmp;
            return txt;
        }

        txt += v / pow;
        if (txt.indexOf("e") != -1) return "-";

        var idx = txt.indexOf(".");
        if (idx == -1) { txt += "."; idx = txt.length - 1; }
        for (var i = txt.length - idx - 1; i < digits; i++) txt += "0";

        return txt;
    }

    txt += v;
    return txt;
}

function format_float(val, digits) {
    var txt = "";
    if (digits > 0) {
        var v = Math.round(val * Math.pow(10, digits));
        return format_intval(v, digits);
    } else {
        txt += Math.round(val);
        return txt;
    }
}

function format_forex_price( price )
{
  var digits = get_digit_by_price( price );
  console.info("price=%s, digist=%s",price, digits);
  return format_float(price, digits);
}

// total is 5
// 1.2 => 4,  100.1 => 2
function get_digit_by_price( price )
{
  var digits = 4;
  if( price>1000)
  { digits = 1;
  }else if( price>100)
  { digits = 2;
  }else if( price>10 )
  {
    digits = 3;
  }
  return digits;
  //return format_float( this.value, digits);
}

function ConvertIntegerToCorrectRate( symbol, val  )
{
  if( symbol == "USUSDJPY")
  {
    return val/100;
  }else{
    return val/10000;
  }
}


$(function () {
  var symbols = [];
  $(".forex-chart[data-symbol]").each(function(){
    symbols.push( $(this).data('symbol') );
  });
  $(".forex-label[data-symbol]").each(function(){
    var $this = $(this);
    var symbol = $this.data('symbol');
    g_quotation_desc.labels[symbol] = $this;
    if( symbols.indexOf( symbol) == -1)
    {
      symbols.push( symbol );
    }
  });
    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });
    if( symbols.length >0 )
    {
      var source = new EventSource('http://better.firecart.cn:8080/sse/'+symbols.join(','));
      source.addEventListener('message', function(e) {
        var data = JSON.parse(e.data);
        if( g_quotation_desc.first_pass )
        {
          g_quotation_desc.first_pass = false;
          InitializeChart( data );
        }else{
          for( var i = 0; i< symbols.length; i++)
          {
            var symbol = symbols[i];
            var time_price = data[symbol];
            var time = (new Date( parseInt(time_price) )).getTime();
            var price= ConvertIntegerToCorrectRate( symbol, parseInt(time_price.split('_')[1]));
            var formatted_price = format_forex_price( price );
            //console.log("data=%s,%s", time, price);
            if(g_quotation_desc.panels[symbol])
            {
               g_quotation_desc.panels[symbol].update( time, price, 1, 0 );
            }
            if(g_quotation_desc.labels[symbol])
            {
              g_quotation_desc.labels[symbol].html(formatted_price );
            }
            // new point added
            //g_quotation_desc.charts[symbols[i]].yAxis[0].plotLines[0].value = price;
          }
        }
        console.log(e);
      }, false);
    }
});



function InitializeChart(message){

  $(".forex-chart").each(function(){
    var $container = $(this);
    var symbol = $container.data('symbol');
    var panel = new BetterFinancialPanel( symbol );
    panel.drawCharts( message[symbol] );

    //FinancialPanel.drawChart( this.id, symbol, message[symbol]);

    g_quotation_desc.charts[symbol] = panel.lineChart;
    g_quotation_desc.panels[symbol] = panel;
  })
  // Create the chart
}

function BetterFinancialPanel( symbol )
{
  this.lineChart = null;
  this.instrumentID = symbol;
  this.lastQuotes= [];
  this.lastTradeID = 0;

  this.currentMinute = Math.floor(this.time / 60000) * 60000;
  Highcharts.setOptions({
      global: {
          useUTC: false
      }
  });
}
BetterFinancialPanel.prototype.convertIntegerToCorrectRate = function ( symbol, val  )
{
  if( symbol == "USUSDJPY")
  {
    return val/100;
  }else{
    return val/10000;
  }
}

// d
BetterFinancialPanel.prototype.drawCharts = function(chartData, b) {
      var c = this.instrumentID;
      var f = this.currentMinute;
      var g = new Date();
      var e = [];
      var rawDtata = chartData.sort();

      for (var i = 0; i < rawDtata.length; i += 1) {
        e.push([
          (new Date( parseInt(rawDtata[i]) )).getTime(),
          this.convertIntegerToCorrectRate( c, parseInt(rawDtata[i].split('_')[1]))
        ]);
      }
      var seriesType = 'line';
      var lineColor = Registry.chartConfig.financialPanel.colors.line;
      var fillColor = {
                          linearGradient : {
                              x1: 0,
                              y1: 0,
                              x2: 0,
                              y2: 1
                          },
                          stops : [[0, Registry.chartConfig.financialPanel.colors.fillColor.top],
                                   [1, Registry.chartConfig.financialPanel.colors.fillColor.bottom]]
                      };

      var a = new Highcharts.StockChart({
          xAxis: {
              gridLineWidth: 1,
              gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
              lineColor: Registry.chartConfig.financialPanel.colors.axis,
              tickLength: 0,
              ordinal: false,
              labels: {
                  formatter: function() {
                      g.setTime(this.value);
                      var j = "H:i";
                      var h = this.axis.series[0].data;
                      if (h.length && (h[h.length - 1].x - h[0].x < (5 * 60000))) {
                          j = "H:i:s"
                      }
                      return Ext.Date.format(g, j)
                  }
              }
          },
          yAxis: {
              id: "advanced-chart-line-y-axis-" + c,
              gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
          },
          chart: {
              renderTo: "advanced-chart-line-" + c,
              plotBorderWidth: 1,
              plotBorderColor: Registry.chartConfig.financialPanel.colors.plotBorder,
              backgroundColor: 'rgba(255,255,255,0)',
              plotBackgroundColor: Registry.chartConfig.financialPanel.colors.plotBackgroundColor
          },
          rangeSelector: {
              enabled: false
          },
          navigator: {
              enabled: false
          },
          scrollbar: {
              enabled: false
          },
          credits: {
              enabled: false
          },
          series: [{
              id: "advanced-chart-line-series-" + c,
              name: "Price",
              data: e,
              type: seriesType,
              threshold : null,
              fillColor: fillColor
          }],
          plotOptions: {
              line: {
                  lineWidth: 1,
                  lineWidth: Registry.chartConfig.financialPanel.lineWidth,
                  dataGrouping: {
                      enabled: false
                  },
                  marker: {
                      states: {
                          hover: {
                              lineColor: Registry.chartConfig.colors.guide,
                              radius: 2
                          }
                      }
                  },
                  events: {
                      click: function(h) {
                          Trading.app.getController("Game").selectClosestTradePoint(h.point)
                      }
                  },
                  allowPointSelect: false
              },
              series: {
                color: lineColor,
                lineWidth: Registry.chartConfig.financialPanel.lineWidth,
                  states: {
                      hover: {
                          lineWidth: 1
                      }
                  }
              }
          },
          tooltip: {
              headerFormat: "<span>{point.key}</span><br/>",
              xDateFormat: "%H:%M:%S",
              pointFormat: "<span>{point.y}</span>",
              borderWidth: 1,
              crosshairs: [{
                  color: Registry.chartConfig.colors.guide,
                  dashStyle: "longdash"
              }],
              formatter: function() {
                  var o = this.points[0].point;
                  var n = "<span>" + Ext.Date.format(new Date(o.x), "H:i:s") + "</span><br/><span>" + o.y + "</span>";
                  if (o.marker && o.marker.keep) {
                      var m = (o.tooltipData.direction == 1) ? Registry._["label-above"] : Registry._["label-below"];
                      n = '<span class="tooltip-label">' + Registry._["game-label-expiry"] + ":</span><span> " + Ext.Date.format(new Date(o.tooltipData.expiry), "H:i:s") + '</span><br/><span class="tooltip-label">' + m + " " + o.y + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-investment"] + ":</span><span> " + Registry.baseCurrencySymbol + o.tooltipData.stake + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-payout"] + ":</span><span> " + o.tooltipData.payout + '%</span><br/><span class="tooltip-label">' + Registry._["label-rebate"] + ":</span><span> " + o.tooltipData.rebate + "%</span>";
                      n += Ext.isEmpty(o.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-label">' + Registry._["label-return-amount"] + ":</span><span> " + Registry.baseCurrencySymbol + o.tooltipData.returnedAmount + "</span>";
                      if (o.tooltipData.social) {
                          var q = o.tooltipData.social.userID;
                          var h = Registry.socialImageUrlPattern.replace("[[[userID]]]", q) + "?v=" + Math.floor(new Date().getTime() / 10000);
                          var k = o.tooltipData.social.nickname;
                          var l = (o.tooltipData.direction == 1) ? "images/small-green-arrow-up-10x11.png": "images/small-red-arrow-down-10x11.png";
                          var m = (o.tooltipData.direction == 1) ? Registry._["short-text-call"] : Registry._["short-text-put"];
                          var j = Ext.isEmpty(o.tooltipData.returnedAmount) ? Registry._["short-text-opened"] : Registry._["short-text-closed"];
                          var p = Ext.isEmpty(o.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-gain">' + Registry._["short-text-gain"] + ": " + Registry.baseCurrencySymbol + o.tooltipData.returnedAmount + "</span>";
                          n = '<div id="tooltip-social-container"><div class="social-user-img-container"><img class="social-user-img" src="' + h + '" /><img class="social-user-arrow-img" src="' + l + '">&nbsp;</img></div><div class="advanced-social-trade-info"><span class="tooltip-nickname">' + k + ((Registry.env == "development") ? " (" + o.tooltipData.tradeID + ") ": "") + '</span><br/><span class="tooltip-status">' + j + " " + Registry._["short-text-a-binary"] + " " + m + " option</span>" + p + "</div></div>"
                      }
                  }
                  return '<div class="tooltip-container">' + n + "</div>"
              },
              useHTML: true
          }
      });
      this.lineChart = a;
      //this.candlestickChart = Trading.app.getController("Game").drawCandlestickChart(c, "advanced-chart-candlestick-", b, e);
      //this.markTrades(c, Trading.app.getController("User").trades.data.items);
      //this.markSocialTrades(c)
}

BetterFinancialPanel.prototype.update = function(j, m, h, n) {
    this.quote(j, m, h, n)

}
// j: lastQuoteTime
// h: raise or drop
// x: j, y: m,
BetterFinancialPanel.prototype.quote = function(j, m, h, n) {
    m = m * 1;
    //var g = Trading.app.getController("Game");
    var f = this.instrumentID;
    //if (this.lastQuotes[f] && (j - this.lastQuotes[f] < Registry.chartUpdateFrequency)) {
    //    return
    //}
    this.lastQuotes[f] = j;
    var d = Registry.chartConfig.colors.line;
    var e;
    var l;
    var c = false;
    var a = this.lineChart;
    var k = this.candlestickChart;
    if (h == 1) {
        d = Registry.chartConfig.colors.up
    } else {
        if (h == -1) {
            d = Registry.chartConfig.colors.down
        }
    }
    e = a.get("advanced-chart-line-series-" + f);
    if (e.data.length) {
        l = e.data[e.data.length - 1];
        if (l.marker && !l.marker.keep) {
            l.marker = {
                enabled: false
            };
            e.data[e.data.length - 1].update(l)
        }
        c = ((j - e.data[0].x) > 3600000)
    }
    l = {
        x: j,
        y: m,
        marker: {
            enabled: true,
            fillColor: d,
            lineColor: Registry.chartConfig.colors.guide,
            lineWidth: 1,
            keep: false
        }
    };
    if (n > this.lastTradeID) {
        var b = g.charts[f].tradesMarkers;
        l.x = b[n].x;
        l.y = b[n].y;
        l.marker = b[n].marker;
        l.tooltipData = b[n].tooltipData;
        l.events = {
            click: function() {
                this.select(true);
                return false
            },
            select: function() {
                a.tooltip.refresh([this])
            },
            unselect: function() {
                a.tooltip.hide()
            }
        }
    }
    e.addPoint(l, true, c);
    a.get("advanced-chart-line-y-axis-" + f).removePlotLine("advanced-chart-line-guide-" + f);
    a.get("advanced-chart-line-y-axis-" + f).addPlotLine({
        id: "advanced-chart-line-guide-" + f,
        value: m,
        color: Registry.chartConfig.colors.guide,
        width: 1,
        dashStyle: "longdash"
    });
    if (n > this.lastTradeID) {
        if (!this.tradesMarkers) {
            this.tradesMarkers = {}
        }
        this.tradesMarkers[n] = e.data[e.data.length - 1];
        Ext.each(Ext.query("#advanced-chart-line-" + f + " image"),
        function(o) {
            if (Ext.isEmpty(o.id)) {
                var p = Ext.getDom("advanced-trade-marker-symbol-" + n);
                if (!p) {
                    o.id = "advanced-trade-marker-symbol-" + n
                }
                return false
            }
        });
        //g.fixTradesMarkersPosition(true);
        //g.setTradesMarkersVisibility(g.showTradesMarkers.myTrades, false, true);
        //g.setTradesMarkersVisibility((this.width == 860), true, true);
        this.lastTradeID = n
    }
    //Trading.app.getController("Game").addPointToCandlestickChart(f, k, j, m)
}

BetterFinancialPanel.prototype.markTrades = function(g, m) {
    var j = this;
    var h = Trading.app.getController("Game");
    var a = j.lineChart;
    var e = a.get("advanced-chart-line-series-" + g);
    var b = h.charts[g].tradesMarkers;
    var f;
    var l;
    var c;
    var k;
    var n;
    var d;
    if (b) {
        Ext.each(m,
        function(o) {
            n = o.data.tradeID;
            if (o.data.instrumentID == g) {
                for (f = e.data.length - 1; f >= 0; f--) {
                    if ((o.data.timestamp > e.data[f].x) && (b[n])) {
                        d = h.getTradeStatus(o, true);
                        c = d.symbol;
                        k = b[n].marker;
                        l = {
                            x: e.data[f].x,
                            y: o.data.strike * 1,
                            marker: {
                                symbol: "url(" + c + ")",
                                keep: k.keep,
                                states: k.states,
                                enabled: k.enabled,
                                fillColor: k.fillColor,
                                lineColor: k.lineColor,
                                lineWidth: k.lineWidth,
                                radius: k.radius
                            },
                            tooltipData: b[n].tooltipData,
                            events: {
                                click: function() {
                                    this.select(true);
                                    return false
                                },
                                select: function() {
                                    a.tooltip.refresh([this])
                                },
                                unselect: function() {
                                    a.tooltip.hide()
                                }
                            }
                        };
                        e.data[f].update(l);
                        if (!j.tradesMarkers) {
                            j.tradesMarkers = {}
                        }
                        j.tradesMarkers[n] = e.data[f];
                        break
                    }
                }
                Ext.each(Ext.query("#advanced-chart-line-" + g + " image"),
                function(p) {
                    if (Ext.isEmpty(p.id)) {
                        var q = Ext.getDom("advanced-trade-marker-symbol-" + n);
                        if (!q) {
                            p.id = "advanced-trade-marker-symbol-" + n
                        }
                    }
                })
            }
        });
        h.fixTradesMarkersPosition(true);
        h.setTradesMarkersVisibility(h.showTradesMarkers.myTrades, false, true);
        h.setTradesMarkersVisibility((this.width == 860), true, true)
    }
},
BetterFinancialPanel.prototype.selectTradeMarker = function(c, b) {
    if (this.tradesMarkers) {
        var a = this.tradesMarkers[c];
        if (a && a.marker) {
            a.select(b, true)
        }
    }
},
BetterFinancialPanel.prototype.updateTradeMarker = function(c) {
    var d = Trading.app.getController("Game");
    var b = c.data.tradeID;
    var a = d.getTradeStatus(c, true);
    if (Ext.fly("advanced-trade-marker-symbol-" + b)) {
        Ext.fly("advanced-trade-marker-symbol-" + b).dom.setAttribute("href", a.symbol)
    }
}

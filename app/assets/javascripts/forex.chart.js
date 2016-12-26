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
// game_type_id = 1, 涨跌，
// game_type_id = 2, 计时， 30s, 1min, 2mins
var Game ={
  current: function( container ){
    var game = Game.createNew(container);
    return game;
  },
  createNew: function(container){
    var game = {};
    game.instrument_last_quote_selector = ".b-instrument-last-quote";
    game.game_round_start_at_selector = ".b-game-round-start-at";
    game.game_type_selector = ".b-game-type.active";
    game.game_expiry_countdown_selector = ".b-game-round-expiry-countdown";
    game.game_type_id = parseInt( $(".b-game-type.active", container).data('game-type') );
    game.expiry_in = parseInt( $(".b-current-expiry-in", container).data('expiry-in') );

    game.game_round_start_at= function(){
      var now = this.current_time();
      var start_at = null;

      if( game.game_type_id == 2){
        start_at = now.add(game.expiry_in, "seconds");
      }else{
        start_at = now.add(5-(now.minutes()%5), "minutes");
      }
      return start_at.seconds(0);
    },
    game.game_round_period= function(){
    //游戏持续秒数
      return game.game_type_id == 1 ? 300 : game.expiry_in;
    },
    // 禁止投注时间
    game.game_round_expiry_at= function(){
      // 300 open in every 2mins
      var now = this.current_time();
      var expiry_at = game.game_round_start_at();

      if( game.game_type_id == 2){
        if( game.expiry_in == 30 )
        {
          expiry_at = expiry_at.subtract( 30, "seconds");
        }else{
          expiry_at = expiry_at.subtract(game.expiry_in - 60, "seconds");
        }
      }
      return expiry_at;
    },
    game.game_round_start_ats= function(){
      var sas = [];
      var now = game.current_time();
      var mins = now.minutes();
      var remainder= mins%5 // start a agme round in each 5 mins
      for(var i=0;i < 60/5; i++){
        var time = game.current_time().subtract(remainder, "minutes").add((i+1)*5,"minutes");
        time.seconds(0);
        sas.push( time )
      }
      return sas;
    },
    game.seconds_left_to_close_bidding=function(){
      //if (game.game_type_id == 2 )
      //  return 60 - game.current_time().seconds();
      //else {
        var delta = game.game_round_expiry_at() - game.current_time() ;
        return (delta>0 ? delta/1000 : 0);
      //}
    },
    game.milliseconds_left_to_start=function(){
       return game.game_round_expiry_at() - game.current_time();
    },
    game.current_time= function(){
      return moment();
    },
    game.last_quote= function(){
      return parseFloat( $( game.instrument_last_quote_selector, container).html() );
    },
    game.game_round_start_at_tags= function(){
      return $( game.game_round_start_at_selector, container);
    },
    game.game_round_expiry_countdown_tag= function(){
      return $( game.game_expiry_countdown_selector, container);
    },

    game.update= function(){
      game.game_round_start_at_tags().each(function(){
        if($(this).data('format')=='l')
        {
          $(this).html( game.game_round_start_at().format("D-MMM hh:mm"));
        }else{
          $(this).html( game.game_round_start_at().format("hh:mm"));
        }
      })
      var s = game.seconds_left_to_close_bidding();
      var time_left = moment.unix( s );
      game.game_round_expiry_countdown_tag().html( time_left.format("mm:ss") );
      var bar_persent = ((game.game_round_period()-s)*100/game.game_round_period()).toString();
      $(".meter span").css("width", bar_persent+"%")
    };

    return game;
  }

}


$(function(){
  //function getGameType(){
  //  return parseInt( $(".game-type.active").data('game-type') );
  //}
  if($(".forex-wrapper").is('*')){
    $(".forex-wrapper").each(function(){
      var container = $(this);
      $("select.b-symbols", container).change(function(){
        location= location.pathname + '?symbol='+ this.value;
      })

      $(".b-bid", container).click(function(){
        var highlow = $(this).data('highlow');
        $("input[name='bid[highlow]']").val( highlow );
        $(".b-bid-icon", container).hide();
        $(".b-bid-icon-"+highlow, container).show();

        $(".b-game-form-invoice-wrapper .payout", container).hide();
        $(".b-game-form-invoice-wrapper .invoice", container).show();
        if(highlow=="1"){
          if($(".put-small-icon").is('*')){
            $(".put-small-icon").attr("class", "call-small-icon")
          }
        }else{
          if($(".call-small-icon").is('*')){
            $(".call-small-icon").attr("class", "put-small-icon")
          }
        }
        $(".bid_result").html("");
      });
      $(".invoice button.close", container).click(function(){
        $(".b-game-form-invoice-wrapper .payout", container).show();
        $(".b-game-form-invoice-wrapper .invoice", container).hide();
      });
      $(".b-bid-cost", container).change(function(){
        var v = $(this).val();
        $(".b-bid-money", container).html( format_float( v*(1+0.7), 2 ) + " (70%)");
      });
      $(".b-bid-more-price", container).click(function(){
        var more = parseInt( $(this).val() );
        var current_cost = $(".b-bid-cost", container).val();
        if(current_cost==''){current_cost=0;}
        var cost = parseInt(current_cost);
        $(".b-bid-cost", container).val(  more + cost );
      });
      $(".b-submit-bid", container).click(function(){
        if( $("form#reg-form, .login-form").is('*') && !$(".forex-simulator-wrapper").is('*')){
          alert("请先登录或注册！");
        }else{
          var game = Game.current( container );
          var quote = game.last_quote();
          $("input[name='game_round[start_at]']", container).val( game.game_round_start_at().toISOString() );
          $("input[name='game_round[period]']", container).val( game.game_round_period() );
          $("input[name='bid[last_quote]']", container).val( quote );

          $("form", container).submit();
        }
      });


      $(".b-game-type", container).click(function(){
        var $this = $(this);
        $(".b-game-type", container).removeClass("active");
        $(this).addClass("active");
        var id = this.id;
        $(".b-game-round-time-wrapper", container).hide();
        $(".b-game-round-time-wrapper."+id, container).show();
      });

      $(".b-expiry-in", container).click(function(){
        var $this = $(this);
        $(".b-current-expiry-in", container).data( {"expiry-in": $this.data("expiry-in")}).html($this.html());
        //var game = Game.current( container );
      });

      $(".b-game-round-expiry-countdown", container).countdown( moment().toDate(), moment().add(1, 'days').toDate(), function(event){
        var game = Game.current( container );
        var $current_expiry_in = $(".b-current-expiry-in", container);
        var $game_expiry_box = $(".b-game-expiry-box", container);
        switch(event.type) {
          case "days":
            break;
          case "hours":
            break;
          case "minutes":
            var start_ats = game.game_round_start_ats();
            $game_expiry_box.empty();
            for(var i=0;i < start_ats.length; i++){
              var time = start_ats[i];
              var today = (time.day() == moment().day()) ? "今天" : "明天";
              $game_expiry_box.append("<option value='"+time.unix()+"'>"+ today +time.format("hh:mm")+"</option>")
            }
            break;
          case "seconds":
            game.update();
            break;
          case "finished":
            break;
        }
      });

    });

  }


})




function format_forex_price( price )
{
  var digits = get_digit_by_price( price );
  //console.info("price=%s, digist=%s",price, digits);
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
  var chart_symbols = [];
  var label_symbols = [];
  var symbols = [];
  $(".forex-chart[data-symbol]").each(function(){
    chart_symbols.push( $(this).data('symbol') );
  });
  $(".b-instrument-last-quote[data-symbol]").each(function(){
    var $this = $(this);
    var symbol = $this.data('symbol');
    //there maybe more than one label
    if( !g_quotation_desc.labels[symbol] )
    {
      g_quotation_desc.labels[symbol] = $(".b-instrument-last-quote[data-symbol='"+symbol+"']");
    }
    if( (label_symbols.indexOf( symbol) < 0) )
    {
      label_symbols.push( symbol );
    }

  });
    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });
    if( chart_symbols.length >0 )
    {
      var source1 = new EventSource('http://www.ballmerasia.com/node/sse/'+chart_symbols.join(','));
      //var source1 = new EventSource('http://127.0.0.1:8080/sse/'+chart_symbols.join(','));
      source1.addEventListener('message', function(e) {
        var data = JSON.parse(e.data);
        if( g_quotation_desc.first_pass )
        {
          g_quotation_desc.first_pass = false;
          InitializeChart( data );
        }else{
          for( var i = 0; i< chart_symbols.length; i++)
          {
            var symbol = chart_symbols[i];
            var time_price = data[symbol];
            var time = (new Date( parseInt(time_price) )).getTime();
            var price= ConvertIntegerToCorrectRate( symbol, parseInt(time_price.split('_')[1]));
            var formatted_price = format_forex_price( price );
            //console.log("data=%s,%s", time, price);
            if(g_quotation_desc.panels[symbol])
            {
               g_quotation_desc.panels[symbol].update( time, price, 1, 0 );
            }
            // new point added
            //g_quotation_desc.charts[symbols[i]].yAxis[0].plotLines[0].value = price;
          }
        }
        console.log(e);
      }, false);
    }
    if( label_symbols.length >0 )
    {
      var source2 = new EventSource('http://www.ballmerasia.com/node/sse_ones/'+label_symbols.join(','));
      //var source2 = new EventSource('http://127.0.0.1:8080/sse_ones/'+label_symbols.join(','));
      source2.addEventListener('message', function(e) {
        var data = JSON.parse(e.data);

          for( var i = 0; i< label_symbols.length; i++)
          {
            var symbol = label_symbols[i];
            console.log("data=%s,%s", symbol, e.data);
            var items = data[symbol];
            // strange. it is called by source1.addEventListener
            if( items)
            {
              var time = (new Date( parseInt(items) )).getTime();
              var price= ConvertIntegerToCorrectRate( symbol, parseInt(items.split('_')[1]));
              var formatted_price = format_forex_price( price );

              if(g_quotation_desc.labels[symbol])
              {
                g_quotation_desc.labels[symbol].html(formatted_price );
              }
            }
            // new point added
            //g_quotation_desc.charts[symbols[i]].yAxis[0].plotLines[0].value = price;
          }

        console.log(e);
      }, false);
    }
});



function InitializeChart(message){

  $(".forex-chart").each(function(){
    var $wrapper = $(this).parent('.forex-wrapper');
    var $container = $(this);
    var symbol = $container.data('symbol');
    var panel = new BetterFinancialPanel( $wrapper, symbol );
    panel.drawCharts( message[symbol] );
    $(".b-chart-candlestick", $wrapper).click(function(){
       panel.showFinancialViewCandleStickChart();
    })
    $(".b-chart-line", $wrapper).click(function(){
       panel.showFinancialViewLineChart();
    })
    //FinancialPanel.drawChart( this.id, symbol, message[symbol]);

    g_quotation_desc.charts[symbol] = panel.lineChart;
    g_quotation_desc.panels[symbol] = panel;
  })
  // Create the chart
}

function BetterFinancialPanel( wrapper, symbol )
{
  //this.container = $(container);
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
  panel = this;

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
      var e = [];// for line chart
      var b = [];// for candlestick chart
      var rawDtata = chartData.sort();

      for (var i = 0; i < rawDtata.length; i += 1) {
        var items = rawDtata[i].split('_');
        e.push([
          (new Date( parseInt(rawDtata[i]) )).getTime(),
          this.convertIntegerToCorrectRate( c, parseInt(rawDtata[i].split('_')[1]))
        ]);
        b.push([
          (new Date( parseInt(rawDtata[i]) )).getTime(),
          this.convertIntegerToCorrectRate( c, parseInt( items[2] )),
          this.convertIntegerToCorrectRate( c, parseInt( items[3] )),
          this.convertIntegerToCorrectRate( c, parseInt( items[4] )),
          this.convertIntegerToCorrectRate( c, parseInt( items[5] ))
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
      this.candlestickChart = this.drawCandlestickChart(c, "advanced-chart-candlestick-", b.slice(0,1), e);
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
    this.addPointToCandlestickChart(f, k, j, m)
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

// c: symbol
// j: container prefix
// a
// b[0] is timestamp
BetterFinancialPanel.prototype.drawCandlestickChart = function(c, j, b, a) {
    var g = [];
    var f = {};
    var d = new Date();
    var e = this;
    Ext.Array.each(b,
    function(l) {
        g.push([l[0], l[1], l[2], l[3], l[4]])
    });
    var k = b[b.length - 1][0];
    Ext.Array.each(a,
    function(m) {
        var l = Math.floor((m[0] - 1000) / 60000) * 60000;
        if (l > k) {
            if (!f[l]) {
                f[l] = []
            }
            f[l].push(m[1])
        }
    });
    Ext.Object.each(f,
    function(q, m) {
        var n = m[0];
        var p = m[m.length - 1];
        var o = Ext.Array.max(m);
        var l = Ext.Array.min(m);
        g.push([q * 1, n, o, l, p])
    });
    var h = new Highcharts.StockChart({
        xAxis: {
            id: "advanced-chart-candlestick-x-axis-" + c,
            gridLineWidth: 1,
            gridLineColor: Registry.chartConfig.colors.axisgrid,
            lineColor: Registry.chartConfig.colors.axis,
            tickLength: 0,
            ordinal: false,
            labels: {
                formatter: function() {
                    d.setTime(this.value);
                    return Ext.Date.format(d, "H:i")
                }
            }
        },
        yAxis: {
            id: "advanced-chart-candlestick-y-axis-" + c,
            gridLineColor: Registry.chartConfig.colors.axisgrid,
            labels: {
                formatter: function() {
                    return e.getFixedQuote(c, this.value)
                }
            }
        },
        chart: {
            renderTo: j + c,
            plotBorderWidth: 1,
            backgroundColor: "rgba(255,255,255,0)"
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
            name: " ",
            id: "advanced-chart-candlestick-series-" + c,
            type: "candlestick",
            data: g
        }],
        plotOptions: {
            candlestick: {
                color: Registry.chartConfig.candlestick.colors.down,
                upColor: Registry.chartConfig.candlestick.colors.up,
                lineColor: Registry.chartConfig.candlestick.colors.line,
                dataGrouping: {
                    enabled: false
                }
            },
            series: {
                states: {
                    hover: {
                        lineWidth: 1
                    }
                }
            }
        },
        tooltip: {
            headerFormat: "<span>{point.key}</span><br/>",
            xDateFormat: "%H:%M",
            pointFormat: "<span>{point.y}</span>",
            borderWidth: 1,
            borderColor: Registry.chartConfig.colors.line,
            crosshairs: [{
                color: Registry.chartConfig.colors.guide,
                dashStyle: "longdash"
            }]
        }
    });
    return h
}
// c: chart
// d: symbol
// h: timestamp
// f: data
BetterFinancialPanel.prototype.addPointToCandlestickChart = function(d, c, h, f) {
    c.get("advanced-chart-candlestick-y-axis-" + d).removePlotLine("advanced-chart-candlestick-guide-" + d);
    c.get("advanced-chart-candlestick-y-axis-" + d).addPlotLine({
        id: "advanced-chart-candlestick-guide-" + d,
        value: f,
        color: Registry.chartConfig.colors.guide,
        width: 1,
        dashStyle: "longdash"
    });
    var g = Math.floor((h - 1000) / 60000) * 60000;
    var e = c.get("advanced-chart-candlestick-series-" + d);
    var a;
    var b = false;
    if (e.data.length) {
        b = ((h - e.data[0].x) > 3600000)
    }
    if ((g === this.currentMinute) && e.data.length) {
        a = e.data[e.data.length - 1];
        a.close = f;
        if (f > a.high) {
            a.high = f
        }
        if (f < a.low) {
            a.low = f
        }
        e.data[e.data.length - 1].update(a)
    } else {
        this.currentMinute = g;
        a = {
            x: g * 1,
            open: f,
            high: f,
            low: f,
            close: f
        };
        e.addPoint(a, true, b)
    }
}

BetterFinancialPanel.prototype.showFinancialViewLineChart= function() {
    var a = this.instrumentID;
    $("#advanced-chart-line-" + a).removeClass("chart-wrapper-hidden");
    $("#advanced-chart-line-" + a).css("visibility", "visible");
    $("#advanced-chart-line-" + a).show();
    $("#advanced-chart-candlestick-" + a).addClass("chart-wrapper-hidden");
    $("#advanced-chart-candlestick-" + a).css("visibility", "hidden");
    $("#advanced-chart-candlestick-" + a).hide();
    if (Registry.userID) {
        $("#financial-view-social-icon").show()
    }
    //Utils.setCookie(this.chartTypeCookieKey, "line", 365, "/")
}
BetterFinancialPanel.prototype.showFinancialViewCandleStickChart = function() {
    var a = this.instrumentID;
    $("#advanced-chart-line-" + a).addClass("chart-wrapper-hidden");
    $("#advanced-chart-line-" + a).css("visibility", "hidden");
    $("#advanced-chart-line-" + a).hide();
    $("#advanced-chart-candlestick-" + a).removeClass("chart-wrapper-hidden");
    $("#advanced-chart-candlestick-" + a).css("visibility", "visible");
    $("#advanced-chart-candlestick-" + a).show();
    if (Registry.userID) {
        $("#financial-view-social-icon").hide()
    }
    //Utils.setCookie(this.chartTypeCookieKey, "candlestick", 365, "/")
}
BetterFinancialPanel.prototype.zoomChart = function(a) {
    if (a === "in") {
        if (this.zoomLevelIndex < this.zoomLevels.length - 1) {
            this.zoomLevelIndex++;
            $("#financial-view-reduce-icon").removeClass("disabled");
            if (this.zoomLevelIndex === this.zoomLevels.length - 1) {
                $("#financial-view-increase-icon").addClass("disabled")
            }
        }
    } else {
        if (a === "out") {
            if (this.zoomLevelIndex > 0) {
                this.zoomLevelIndex--;
                $("#financial-view-increase-icon").removeClass("disabled");
                if (this.zoomLevelIndex === 0) {
                    $("#financial-view-reduce-icon").addClass("disabled")
                }
            }
        }
    }
    this.updateChartZoomRange(this.selectedGameID)
}
BetterFinancialPanel.prototype.updateChartZoomRange = function(b) {
    var d = this.charts[b];
    var f = "chart-series-" + b;
    var c = d.get(f);
    var e = d.get("chart-x-axis-" + b);
    if (!c || !c.data.length) {
        return
    }
    var a = c.data[c.data.length - 1].x;
    if (a - c.data[0].x < (this.zoomLevels[this.zoomLevelIndex] - 5) * 60000) {
        return
    }
    e.setExtremes(a - this.zoomLevels[this.zoomLevelIndex] * 60000, null);
    this.stretchCharts(b);
    this.moveChartIndicator(b);
    this.colorBackground(b);
    d = this.candlestickCharts[b];
    if (!d) {
        return
    }
    f = "advanced-chart-candlestick-series-" + b;
    c = d.get(f);
    e = d.get("advanced-chart-candlestick-x-axis-" + b);
    if (!c || !c.data.length) {
        return
    }
    a = c.data[c.data.length - 1].x;
    e.setExtremes(a - this.zoomLevels[this.zoomLevelIndex] * 60000, null);
    this.stretchCharts(b);
    this.moveChartIndicator(b);
    this.colorBackground(b)
}
BetterFinancialPanel.prototype.getFixedQuote = function(c, b) {
    //var a = this.instruments.getById(c).data.precision * 1;
    //return new Number(b * 1).toFixed(a)
    return b;
}

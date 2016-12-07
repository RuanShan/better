var g_quotation_desc = {
    first_pass: true,
    symbols: {},
    fields: {},
    req_fields: {},
    symbol_data: [],
    charts: {},
    labels: {}
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
  //var symbols = ['USEURUSD','USGBPUSD'];
    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });

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
          if(g_quotation_desc.charts[symbol])
          {
            g_quotation_desc.charts[symbol].series[0].addPoint([time, price], true,true);
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

});

function InitializeChart(message){

  $(".forex-chart").each(function(){
    var $container = $(this);
    var symbol = $container.data('symbol');

    var chart = new Highcharts.StockChart({
      credits: {
        enabled: false
      },
        chart: {
          renderTo: this.id
        },
        navigator: {
          height: 0
        },
        scrollbar: {
          enabled : false
        },
        tooltip: {
          valueDecimals: 4,
          formatter: function () {
                  var s = '<b>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '</b>';
                  s += '<br/><b>' +Highcharts.numberFormat(this.y, 4) + '</b>';
                  return s;
          }
        },
        yAxis:{
          labels:
          {
            formatter: function(){
              return format_forex_price( this.value );
              //return format_float( this.value, digits);
            }
          }
        },
        rangeSelector: {
            buttons: [{
              count: 60,
                type: 'minute',
                text: '60M'
            }, {
                count: 30,
                type: 'minute',
                text: '30M'
            }, {
                count: 15,
                type: 'minute',
                text: '15M'
            }],
            inputEnabled: false,
            selected: 0
        },
        title : {
            //text : symbol
        },
        exporting: {
            enabled: false
        },
        series : [{
            name : 'data',
            data : (function () {
              //var container = $("#"+this.renderTo);
              //var symbol = $container.data('symbol');
              var raw_data = message[symbol];
                // generate an array of random data
                var data = [];
                raw_data = raw_data.sort();
                for (var i = 0; i < raw_data.length; i += 1) {
                  data.push([
                    (new Date( parseInt(raw_data[i]) )).getTime(),
                    ConvertIntegerToCorrectRate( symbol, parseInt(raw_data[i].split('_')[1]))
                  ]);
                }
                return data;
            }()),
            lineWidth: 1

        }]
    });
    g_quotation_desc.charts[symbol] = chart;

  })
  // Create the chart
}

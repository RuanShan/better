// require jquery moment
function BetterFinancialPanelPlus() {
  var o = {
    eventSource: null,
    currentInstrument: null,
    urlBaseSecure: 'http://www.ballmerasia.com/node/',
    chartData: {
        chartHistory: [],
        chartConstants: {
            candleLengthByPeriod: {
                1 : 1,
                2 : 2,
                5 : 5,
                168 : 120,
                336 : 240
            },
            zoomLevels: [1, .85, .6, .45, .3]
        },
        chartStates: {
            chartPeriod: 1,
            periodPerCandle: 1,
            chartType: "area",
            currentZoom: 1,
            precision: 5,
            showDotIndicator: !1,
            expiry: null,
            instrument: null,
            openTrades: [],
            closeTrades: [],
            gameType: 2,
            direction: 0
        }
    },
    activeGameTypes: [1, 2, 11],
    instruments: [],
    opensAt: [],
    isOpen: !1,
    tradeParams: {
        payout: "",
        rebate: "",
        direction: 0,
        stake: 1,
        userCurrency: "CNY",
        userCurrencyStake: "",
        strike: "",
        distance: "",
        instrumentID: null,
        expiry: null,
        gameType: 1
    },
    selectedChance: null,
    currentPayout: 0,
    expiries: [],
    expiry: null,
    availableGames: [{
        title: ("High/Low"),
        icon: "icon-high-low",
        disabled: !1,
        show: !0,
        gameTypes: [1, 2, 11],
        gameType: 1,
        gameClass: "highLowMobileClass"
    },
    {
        title: ("Above/Below"),
        icon: "icon-above-below",
        disabled: !1,
        show: !0,
        gameTypes: [3],
        gameType: 3,
        gameClass: "aboveBelowMobileClass"
    }],
    sortDataByTimestamp: function(a) {
        return a ? (a.sort(function(a, b) {
            return a[0] - b[0]
        }), a) : []
    },
    fixEmptyCloseQuote: function(a) {
        return angular.forEach(a,
        function(a, b) {
            a[4] || (a[4] = a[1])
        }),
        a
    },
    isGameEnabled: function() {
        return ! _.isEmpty(o.expiries.availableExpiries) && !_.isEmpty(o.chartData.chartHistory)
    },
    changeCurrency: function(c) {
        var d = {
            method: "POST",
            url: m.urlBaseSecure + "/ajax/index/set-view-currency",
            data: "currency=" + c
        };
        return a(d).then(function(a) {
            var b = a.data; ! b.success
        },
        function(a) {
            return b.reject(a)
        })
    },
    startTrade: function(c) {
        c.source = "xs" === l["class"] ? window.cordova ? "Mobile - WOW App": "Mobile - WOW Web": "WOW Platform",
        c.practice = m.practiceMode ? 1 : 0;
        var h = {
            method: "POST",
            url: m.urlBaseSecure + "/ajax/user/trade",
            data: c,
            responseType: "json"
        };
        return a(h).then(function(a) {
            var h = a.data;
            if (h.success) {
                d.reserve(c.stake),
                c.tradeID = h.details.tradeID,
                c.type = c.gameType,
                c.timestamp = h.details.timestamp;
                var i = f.instruments[c.instrumentID].precision;
                return c.type >= 3 && c.type < 7 && (c.strike = (Number(c.strike) + c.direction * c.distance).toFixed(i)),
                e.openTrades.push(c),
                g.$broadcast("openTradesUpdated", e.openTrades),
                g.$broadcast("newTrade", c),
                h
            }
            return b.reject(h.message)
        },
        function(a) {
            return console.log(a),
            b.reject(a)
        })
    },
    selectExpiry: function(a) {
        if (_.isEmpty(a)) return void(o.expiry = o.chartData.chartStates.expiry = null);
        angular.forEach(o.expiries.availableExpiries,
        function(a) {
            a && (a.active = !1)
        }),
        a.active = !0;
        var b = angular.copy(a),
        c = o.tradeParams.instrumentID;
        o.expiry = o.chartData.chartStates.expiry = b,
        b.gameType > 2 && b.gameType < 7 ? o.currentPayout = _.get(o, ["instruments", c, "payouts", b.gameType, "payoutRanges", j[o.selectedChance], "payout"]) : o.currentPayout = b.payout,
        o.tradeParams.rebate = b.rebate,
        o.tradeParams.expiry = b.timestamp.getTime(),
        o.tradeParams.gameType = b.gameType,
        g.$broadcast("expiryChanged", b)
    },
    getExpiryIndex: function(a) {
        var b = _.findIndex(a,
        function(a) {
            return 2 === a.gameType
        });
        if (o.expiry) {
            var c = _.findIndex(a,
            function(a) {
                return o.expiry.gameType < 7 && a.gameType === o.expiry.gameType ? a.expiry === o.expiry.expiry && a.round === o.expiry.round: 7 !== o.expiry.gameType && 11 !== o.expiry.gameType || a.gameType !== o.expiry.gameType ? a.gameType === o.expiry.gameType: _.isEqual(a.timestamp, o.expiry.timestamp)
            });
            return c > -1 ? c: b > -1 ? 1 : 0
        }
        return b > -1 ? 1 : 0
    },
    selectInstrument: function(a) {
        o.opensAt = o.getAssetOpenHours(a),
        _.each(o.instruments, function(a) {
            a.active = !1
        });
        var b = _.find(o.instruments, function(b) {
            return b.instrumentID == a
        });
        b && (b.active = !0),
        o.tradeParams.instrumentID = a,
        o.chartData.chartStates.instrument = o.instruments[a];
        o.currentInstrumentID = a;
        var c = [1];//o.expiries.getExpiries(a, o.activeGameTypes);
        o.isOpen = o.isGameTypeOpenPerInstrumentId(a),
        !_.isEmpty(c) && c[0] ? o.setHistoryToChart(o.chartData.chartStates.chartPeriod).then(function() {
            //o.expiries.availableExpiries = o.expiries.addThirtySecExpiry(c),
            //o.selectExpiry(o.expiries.availableExpiries[o.getExpiryIndex(o.expiries.availableExpiries)])
        }) : (o.expiry = o.chartData.chartStates.expiry = null, o.expiries.availableExpiries = null);
        o.subscribeToInstrument(a);
        //g.$broadcast("instrumentChanged", a, o.opensAt, o.isOpen)
    },
    setHistoryToChart: function(a, b) {
        o.chartData.chartHistory = [],
        o.chartData.chartStates.chartType = b ? b: o.chartData.chartStates.chartType,
        o.chartData.chartStates.chartPeriod = a;
        var c, d = o.tradeParams.instrumentID;
        return "candlestick" === o.chartData.chartStates.chartType ? o.chartData.chartStates.periodPerCandle = o.chartData.chartConstants.candleLengthByPeriod[a] : o.chartData.chartStates.periodPerCandle = 0,
        o.getHistory(d, a, c, o.chartData.chartStates.periodPerCandle).then(function(a) {
            //o.chartData.chartStates.precision = o.instruments[d].precision,
            //o.chartData.chartHistory = o.sortDataByTimestamp(a[d]),
            //"candlestick" === o.chartData.chartStates.chartType && (o.chartData.chartHistory = o.fixEmptyCloseQuote(o.chartData.chartHistory)),
            //jQuery.publish("chartHistoryChanged", o.chartData.chartHistory, o.chartData.chartStates.precision)
            var series = o.chartObj.get("chart-series");
            series.update({ type: o.chartType },!1), series.setData(a, !1), o.chartObj.redraw();

        })
    },
    getAssetOpenHours: function(a) {
        if (!o.instruments[a]) return ! 1;
        var b = _.findIndex(o.instruments[a].tradingHours,
        function(a) {
            return a.gameType === o.availableGames[o.availableGames.activeGame].gameType
        });
        return o.instruments[a].tradingHours[b] ? o.instruments[a].tradingHours[b].opensAt: 0
    },
    isGameTypeOpenPerInstrumentId: function(a) {
        if (!o.instruments[a]) return ! 1;
        var b = _.findIndex(o.instruments[a].tradingHours,
        function(a) {
            return a.gameType === o.availableGames[o.availableGames.activeGame].gameType
        });
        return !! o.instruments[a].tradingHours[b] && o.instruments[a].tradingHours[b].isOpen
    },
    getRegistryObj: function(){ return Registry; },
    getHistory: function(symbol){
      // start, from, symbol
      var url =  o.urlBaseSecure+ "/forex_history/"+symbol;
      return $.ajax({url:url}).then( function(res) {
        return o.fixData(res);})
    },
    fixData: function( rawData){
      rawDtata = rawData.sort();
      var data = [];
      for (var i = 0; i < rawDtata.length; i += 1) {
        data.push([
          (new Date( parseInt(rawDtata[i]) )).getTime(),
          o.convertIntegerToCorrectRate( parseInt(rawDtata[i].split('_')[1]))
        ]);
      }
      return data;
    },
    convertIntegerToCorrectRate: function (  val  )
    {
      if( o.currentInstrumentID == "USUSDJPY")
      {
        return val/100;
      }else{
        return val/10000;
      }
    },
    subscribeToInstrument: function(){
      if( o.eventSource ){
        o.eventSource.close();
      }
      var url = o.urlBaseSecure+ "/sse_one/"+o.currentInstrumentID;
      var source = new EventSource(url);
      source.addEventListener('message', function(e) {
        var data = JSON.parse(e.data);
        var symbol = o.currentInstrumentID;
        var time_price = data[symbol];
        var time = (new Date( parseInt(time_price) )).getTime();
        var price= o.convertIntegerToCorrectRate( parseInt(time_price.split('_')[1]));
        var series = o.chartObj.get("chart-series");
        var quote = {timestamp: time, last: price };
        o.updateQuote( quote );
      })
      o.eventSource = source;
    }

  };

  var a = o;
  a.appInit = function(){
    var j, k = true,
    l = a.getRegistryObj(),
    m = a.chartData.chartConstants.zoomLevels,
    n = a.chartData.chartConstants.candleLengthByPeriod,
    o = a.chartData.chartStates.periodPerCandle,
    p = !0,
    q = function() {
        var a = this.tradeObj,
        b = function(a) {
            var b = "",
            d = "";
            if (!a.expired) var e = moment(a.expiry).format("DD-MMM-YYYY HH:mm");
            return d = a.gameType < 3 ? 1 === a.direction ? ("High") : ("Low") : 1 === a.direction ? ("Above") : ("Below"),
            a.expired || (b += ("Expiry") + ": <strong>" + e + "</strong><br />"),
            b += d + " " + a.strike + " < /strong>",
            a.userCurrencyStakeWithSymbol && (b += "<br />" + ("Investment") + ": <strong>" + a.userCurrencyStakeWithSymbol + "</strong>"),
            a.expired || (b += "<br />" + ("Payout") + ": <strong>" + a.payout + "%</strong>", a.rebate && (b += "<br />" + ("Rebate") + ": <strong>" + a.rebate + "%</strong>")),
            b
        };
        return b(a)
    },

    s = function(a, b) {
        return _.findIndex(a,
        function(a) {
            return a === b
        })
    },
    t = function(b, c) {
        var d, c = !!c,
        e = _.head(M.xData);
        angular.forEach(b,
        function(b, f) {
            b.timestamp = c ? b.createdTimestamp: b.timestamp,
            d = s(L.xData, b.timestamp),
            b.instrumentID == a.instrumentId && e <= b.timestamp ? b.hasMarker || (c && (b.closed = !0), u(b)) : (d > -1 && L.data[d].remove(), b.hasMarker = !1)
        }),
        a.chartObj.redraw()
    },
    u = function(b) {
        if (!_.isEmpty(a.chartObj) && !_.isEmpty(M)) {
            var c = v(b),
            d = c.symbol,
            e = c.fillColor,
            f = !1;
            b.social && (f = {
                userID: b.userID,
                nickname: b.nickname
            });
            var g = {
                tradeObj: b,
                id: b.tradeID,
                x: parseInt(b.timestamp),
                fillColor: e,
                shape: d,
                tradeData: b,
                selected: b.selected
            },
            h = _.findIndex(M.xData,
            function(a) {
                return a === b.timestamp
            }),
            i = _.findIndex(L.xData,
            function(a) {
                return a === b.timestamp
            }),
            j = b.timestamp - M.xAxis.dataMax;
            if ((j > 0 || h === -1 && !b.expired) && 3 !== b.gameType) {
                var k = {
                    x: parseInt(b.timestamp) + j,
                    y: parseFloat(b.strike)
                };
                M.addPoint(k)
            }
            b.timestamp >= M.xAxis.dataMin && (i !== -1 && L.data[i].remove(!1), L.addPoint(g, !1), b.hasMarker = !0)
        }
    },
    v = function(a) {
        var b, c, d = l.chartConfig.base.markers,
        e = parseFloat(a.strike),
        f = parseFloat(a.expiryPrice),
        g = parseInt(a.direction),
        h = parseInt(a.stake),
        i = parseInt(a.payout),
        j = parseInt(a.rebate),
        k = a.expired,
        m = e - f,
        n = !0,
        o = l.chartConfig.chart.markerDefaultColor,
        p = 1 === g ? "text:ï„¹": "text:ï„·";
        return p = p + (a.selected ? ":selected": ":deselected") + (a.expired ? ":expired": ""),
        a.closed && (f = parseFloat(a.expiry), h = parseInt(a.amount), m = e - parseFloat(a.expiry)),
        k ? m * g < 0 ? (b = h + h * i / 100, c = "in", o = l.chartConfig.chart.markerInColor) : m * g > 0 ? (b = h * j / 100, c = "out", o = l.chartConfig.chart.markerOutColor) : (b = h, c = "at", o = l.chartConfig.chart.markerAtColor) : (b = null, c = "open", n = !1),
        a.social && (p = k ? d.trades.symbols.close.social: d.trades.symbols.open.social),
        {
            status: c,
            symbol: p,
            payoff: b,
            closed: n,
            fillColor: o
        }
    },
    w = function(b, c) {
        var d = [b.timestamp, b.last];
        M.addPoint(d, !1);
        x(b.last, a.stickyDirection)

    },
    x = function(b, d, e) {
        if (1 * l.chartConfig.indicator) {
            var f, g, h, i, j, k, m = [],
            n = [],
            o = M.data[M.data.length - 1],
            p = M.data[M.data.length - 2],
            q = J.getExtremes(),
            r = a.quoteAbove,
            s = a.quoteBelow,
            t = q.max,
            u = q.min,
            v = 1.0001;
            if (3 !== a.gameType && _.isEmpty(a.distance) ? (u = null, t = null) : (r && q.max < r && (t = parseFloat(r * v)), s && q.min > s && (u = parseFloat(s / v))), J.setExtremes(u, t, !1), q = J.getExtremes(), e = e ? e: a.selectedTrade) switch (e.statusLabelClass) {
            case 1:
                k = l.chartConfig.wow.inTheMoney.color,
                h = l.chartConfig.wow.inTheMoney.LabelClassColor;
                break;
            case - 1 : k = l.chartConfig.wow.outTheMoney.color,
                h = l.chartConfig.wow.outTheMoney.LabelClassColor;
                break;
            default:
                k = l.chartConfig.wow.atTheMoney.color,
                h = l.chartConfig.wow.atTheMoney.LabelClassColor
            }
            if (a.coloredDirection = d ? d: a.coloredDirection, !a.directionBandsHidden || d ? (1 === a.coloredDirection && (i = "above-band", k = l.chartConfig.chart.aboveBand.color, r && s && 3 === a.gameType ? (f = r, g = q.max) : (f = parseFloat(b), g = q.max)), a.coloredDirection === -1 && (i = "below-band", k = l.chartConfig.chart.belowBand.color, r && s && 3 === a.gameType ? (f = s, g = q.min) : (f = parseFloat(b), g = q.min)), n.push({
                from: f,
                to: g,
                color: k,
                zIndex: 8,
                id: i
            })) : _.isEmpty(e) || e.expired || (f = parseFloat(e.strike), g = 3 === e.gameType ? 1 === e.direction ? q.max: q.min: b, i = 1 === e.direction ? "above-band": "below-band", j = 3 === e.gameType ? 1 === e.direction ? "bottom": "top": e.currentPrice < parseFloat(e.strike) ? "top": "bottom", n.push({
                from: f,
                to: g,
                color: k,
                zIndex: 8,
                id: i,
                label: {
                    text: (e.statusLabel),
                    verticalAlign: j,
                    align: "center",
                    style: {
                        color: h,
                        fontSize: "12px",
                        padding: "5px",
                        "border-radius": "5px",
                        background: "rgba(34, 34, 34, 0.57)"
                    },
                    useHTML: !0
                }
            })), o && p) for (var w = b >= p.y ? "#b4d880": "#fb6077", x = 2; x < 7; x++) p = M.data[M.data.length - x],
            p && p.update({
                marker: {
                    enabled: !1
                }
            },
            !1);
            o && o.update({
                marker: {
                    enabled: !0,
                    fillColor: w,
                    symbol: "circle",
                    radius: 3
                }
            },
            !1),
            m.push({
                id: "chart-guide-y-axis",
                value: b,
                color: l.chartConfig.chart.indicatorLine.color,
                width: l.chartConfig.chart.indicatorLine.width,
                zIndex: 9,
                dashStyle: "longdash",
                label: {
                    text: '<div class="chart-indicator">' + b.toFixed(a.precision) + "</div>",
                    align: "right",
                    y: -5,
                    x: 63,
                    useHTML: !0
                }
            }),
            3 === a.gameType && m.push({
                id: "below-line",
                value: s,
                zIndex: 10,
                color: l.chartConfig.chart.indicatorBelowLine.color,
                width: l.chartConfig.chart.indicatorBelowLine.width,
                dashStyle: "solid",
                label: {
                    text: '<div class="chart-indicator chart-indicator-below">' + s + "</div>",
                    align: "right",
                    y: -5,
                    x: 63,
                    useHTML: !0
                }
            },
            {
                id: "above-line",
                value: r,
                zIndex: 10,
                color: l.chartConfig.chart.indicatorAboveLine.color,
                width: l.chartConfig.chart.indicatorAboveLine.width,
                dashStyle: "solid",
                label: {
                    text: '<div class="chart-indicator chart-indicator-above">' + r + "</div>",
                    align: "right",
                    y: -5,
                    x: 63,
                    useHTML: !0
                }
            }),
            J.update({
                plotLines: m,
                plotBands: n
            },
            !1),
            a.chartObj.redraw()
        }
    },
    y = function(b) {
        switch (a.showChartLoader = !0, a.currentView = b, H(), b) {
        case 0:
            a.chartType = "line";
            break;
        case 1:
            a.chartType = "area";
            break;
        case 2:
            a.chartType = "candlestick"
        }
        a.callBack()(a.chartPeriod, a.chartType),
        "candlestick" === a.chartType ? L.hide() : L.show()
    };
    a.changeChartView = y;
    a.updateQuote = w;
    var initializeChartOptions = function(a, b, e) {
        var f = e || "area",
        g = "chart-series",
        h = l.chartConfig.grid.axisLabel.color ? {
            color: l.chartConfig.grid.axisLabel.color
        }: {},
        i = null;
        l.chartConfig.chart.gradientTop && l.chartConfig.chart.gradientBottom && (i = {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [[0, l.chartConfig.chart.gradientTop], [1, l.chartConfig.chart.gradientBottom]]
        });
        var j = {
            id: "chart-x-axis",
            gridLineWidth: 1,
            gridLineColor: l.chartConfig.grid.xAxisLine.color,
            gridZIndex: 0,
            lineColor: l.chartConfig.grid.bottomGridLine.color,
            tickLength: 0,
            ordinal: !1,
            minTickInterval: 6e4,
            labels: {
                style: h,
                rotation: 0,
                formatter: function() {
                    return moment(this.value).format("HH:mm")
                }
            }
        },
        m = {
            id: "chart-y-axis",
            gridLineColor: l.chartConfig.grid.yAxisLine.color,
            gridZIndex: 0,
            labels: {
                formatter: function() {
                    return this.value ? this.value.toFixed(b) : 0
                },
                style: h,
                x: -10
            },
            minPadding: .25,
            maxPadding: .25,
            opposite: !0,
            offset: 70,
            useHTML: !0
        },
        n = {
            renderTo: "chart-wrapper",
            plotBorderColor: l.chartConfig.grid.border.color,
            plotBorderWidth: l.chartConfig.grid.border.width,
            backgroundColor: l.chartConfig.grid.outerBackground.color,
            plotBackgroundColor: l.chartConfig.grid.innerBackground.color
        },
        o = {
            enabledIndicators: !0,
            headerFormat: "<span>{point.key}</span><br/>",
            xDateFormat: "%H:%M:%S",
            pointFormat: "<span><strong>{point.y}</strong></span><br/>",
            crosshairs: [{
                color: "rgba(232, 232, 232, 0.4)",
                zIndex: 7,
                dashStyle: "longdash"
            }],
            useHTML: !0
        },
        p = {
            id: g,
            data: a,
            type: f,
            threshold: null,
            fillColor: i,
            tooltip: o
        },
        r = {
            enable: !0,
            headerFormat: "",
            useHTML: !0,
            animation: !1,
            followPointer: !0,
            pointFormatter: q,
            crosshairs: [{
                color: "rgba(232, 232, 232, 0.4)",
                zIndex: 7,
                dashStyle: "longdash"
            }]
        },
        s = {
            id: "flagSeries",
            type: "flags",
            data: [],
            cursor: "pointer",
            allowPointSelect: !0,
            onSeries: g,
            linkedTo: g,
            lineWidth: 0,
            useHTML: !0,
            y: -9,
            states: {
                hover: {
                    enabled: !0,
                    radius: 20
                }
            },
            fillColor: l.chartConfig.chart.markerDefaultColor,
            tooltip: r,
            point: {
                events: {
                    click: function(a) {
                        D(a.point.tradeObj)
                    },
                    update: function(a) {},
                    mouseOut: function(a) {},
                    mouseOver: function(a) {},
                    select: function(a) {},
                    remove: function(a) {}
                }
            },
            title: " "
        },
        t = {
            pointWidth: true ? 3 : 7,
            color: l.chartConfig.chart.candlestick.backgroundColor,
            upColor: l.chartConfig.chart.candlestick.backgroundUpColor,
            lineColor: l.chartConfig.chart.candlestick.borderColor,
            upLineColor: l.chartConfig.chart.candlestick.borderUpColor,
            tooltip: {
                headerFormat: "<span>{point.key}</span><br/>",
                xDateFormat: "%H:%M:%S",
                pointFormat: "<span>" + ("Open") + ":</span> <span><strong>{point.open}</strong></span></div><div><span>" +  ("High") + ":</span> <span><strong>{point.high}</strong></span></div><div><span>" +  ("Low") + ":</span> <span><strong>{point.low}</strong></span></div><div><span>" +  ("Close") + ":</span> <span><strong>{point.close}</strong></span></div>",
                useHTML: !0
            },
            states: {
                hover: {
                    enabled: !1
                }
            },
            turboThreshold: 0
        },
        u = {
            color: l.chartConfig.chart.line.color,
            lineWidth: l.chartConfig.chart.line.width,
            turboThreshold: 0
        },
        v = {
            color: l.chartConfig.chart.line.color,
            lineWidth: l.chartConfig.chart.line.width,
            turboThreshold: 0
        },
        w = {
            candlestick: t,
            line: u,
            area: v,
            series: {
                dataGrouping: {
                    enabled: !1
                },
                allowPointSelect: !1,
                marker: {
                    enabled: !1,
                    states: {
                        hover: {
                            enabled: !1
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: !1
                    }
                }
            }
        },
        x = {
            xAxis: j,
            yAxis: m,
            chart: n,
            tooltip: {
                enabled: k
            },
            rangeSelector: {
                enabled: !1
            },
            navigator: {
                enabled: !1
            },
            scrollbar: {
                enabled: !1
            },
            credits: {
                enabled: !1
            },
            series: [p, s],
            plotOptions: w,
            exporting: {
                enabled: !1
            },
            indicators: []
        };
        return x
    },

    z = function(b) {
        _.isEmpty(a.chartObj) || (H(), J.setExtremes(null, null, !1), M.update({
            type: a.chartType
        },
        !1), M.setData(b, !1), a.chartObj.redraw())
    },
    A = function(b) {
        if (!_.isEmpty(a.expiry) && !_.isEmpty(a.chartObj)) {
            a.currentZoom = b ? b: a.currentZoom;
            var c = a.expiry,
            d = a.chartPeriod,
            e = c.timestamp.getTime(),
            g = (c.deadPeriod, e - 1e3 * c.deadPeriod),
            h = i.time,
            j = 40,
            k = 20;
            d > 1 && !b && (a.currentZoom = 1, j = 60, k = 60);
            var n = h - m[a.currentZoom] * d * j * 60 * 1e3,
            o = h + m[a.currentZoom] * d * k * 60 * 1e3,
            p = [];
            K.setExtremes(n, o, !1),
            K.update({
                breaks: p,
                plotLines: [{
                    id: "chart-dead-period-line",
                    value: g,
                    width: 2,
                    zIndex: 3,
                    color: l.chartConfig.deadPeriodLineColor,
                    label: {
                        text: f(g, "HH:mm:ss"),
                        verticalAlign: "top",
                        style: {
                            color: l.chartConfig.expiryLabel.color
                        }
                    }
                },
                {
                    id: "chart-expiry-line",
                    value: e,
                    width: 2,
                    zIndex: 3,
                    color: l.chartConfig.expiryLineColor,
                    label: {
                        text: f(e, "HH:mm:ss"),
                        verticalAlign: "top",
                        style: {
                            color: l.chartConfig.expiryLabel.color
                        }
                    }
                }],
                plotBands: [{
                    id: "chart-dead-period-band",
                    from: g,
                    to: e,
                    zIndex: 2,
                    color: {
                        linearGradient: {
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 1
                        },
                        stops: [[0, l.chartConfig.deadPeriodBand.gradientTop], [1, l.chartConfig.deadPeriodBand.gradientBottom]]
                    }
                }]
            },
            !1),
            a.chartObj.redraw()
        }
    },
    B = function() {
        b.$broadcast("unselectDirection")
    },
    C = function(a, b) {
        angular.forEach(a,
        function(a, c) {
            b ? a.selected = b.tradeID === a.tradeID && !b.selected: a.selected = !1
        })
    },
    D = function(b) {
        if (!b) return a.selectedTrade = null,
        void C(a.openTrades, null);
        a.selectedTrade = b;
        var c = a.chartObj.get(b.tradeID);
        c && "candlestick" !== a.chartType && (c.selected ? (c.select(!1), a.selectedTrade = null) : c.select(!0)),
        C(a.openTrades, b),
        _.isEmpty(a.quoteData) || x(a.quoteData.last, a.stickyDirection, a.selectedTrade)
    },
    E = function() {
        a.$watch("closeTrades",
        function(b, c) {
            _.isEmpty(b) || "candlestick" == a.chartType || t(b, !0)
        })
    },
    F = function() {
        _.isEmpty(a.quoteData) || (a.quoteAbove = null, a.quoteBelow = null, a.distance = 0, a.precision = 5)
    },
    G = function(b, c) {
        a.showChartLoader = !0,
        c ? (a.showOutOfTradingHours = !1, a.showNotAvailable = !1) : 0 === b ? (a.showNotAvailable = !0, a.showOutOfTradingHours = !1) : (a.showNotAvailable = !1, a.showOutOfTradingHours = !0)
    },
    H = function() {
        var b = a.chartObj.indicators.allItems || [];
        angular.forEach(b,
        function(b, c) {
            var d = _.find(a.indicatorConfig,
            function(a) {
                return a.type === b.name
            });
            d.isActive = !1,
            b.destroy()
        })
    },
    I = function(b) {
        var c = a.chartObj.indicators.allItems || [],
        d = _.findIndex(c,
        function(c) {
            return c.name === a.indicatorConfig[b].type
        });
        _.isEmpty(a.chartObj) || (d === -1 ? (a.chartObj.addIndicator(a.indicatorConfig[b], !0), a.indicatorConfig[b].isActive = !0) : (c[d].destroy(), a.indicatorConfig[b].isActive = !1))
    };
    a.toggleIndicator = I,
    a.zoomInOut = function(b) {
        b ? a.currentZoom = a.currentZoom < m.length - 1 ? a.currentZoom + 1 : a.currentZoom: a.currentZoom = a.currentZoom > 0 ? a.currentZoom - 1 : a.currentZoom,
        A(a.currentZoom)
    },
    a.changePeriodBtnLabel = function(b) {
        a.currentPeriod = b
    },
    a.precision = a.chartData.chartStates.precision,
    a.showDotIndicator = a.chartData.chartStates.showDotIndicator,
    a.expiry = a.chartData.chartStates.expiry,
    a.opensAt = a.opensAt > 0 && a.opensAt,
    a.gameType = a.chartData.chartStates.gameType,
    a.chartObj = new Highcharts.StockChart(initializeChartOptions(a.chartData, a.precision, a.chartType)),
    a.directionBandsHidden = !0,
    a.sentimentMode = l.sentimentMode;
    var J = a.chartObj.get("chart-y-axis"),
    K = a.chartObj.get("chart-x-axis"),
    L = a.chartObj.get("flagSeries"),
    M = a.chartObj.get("chart-series");

    a.loaderSize = false ? "small": "big",
    a.showChartLoader = !0,
    a.showOutOfTradingHours = !1,
    a.currentZoom = m.length - 1,
    a.showChartControllers = !1,
    a.currentView = 1,
    a.currentPeriod = 0,
    a.chartPeriods = [{
        label: "1h",
        title: ("1 Hour"),
        period: 1,
        disabled: !1,
        //action: a.callBack()
    },
    {
        label: "2h",
        title: ("2 Hours"),
        period: 2,
        disabled: !1,
        //action: a.callBack()
    },
    {
        label: "5h",
        title: ("5 Hours"),
        period: 5,
        disabled: !1,
        //action: a.callBack()
    },
    {
        label: "1w",
        title: ("1 Week"),
        period: 168,
        disabled: !0,
        //action: a.callBack()
    },
    {
        label: "2w",
        title: ("2 Weeks"),
        period: 336,
        disabled: !0,
        //action: a.callBack()
    }],
    a.chartViewOptions = [{
        title: ("Line view"),
        icon: "icon-line",
        disabled: !1,
        action: y
    },
    {
        title: ("Area view"),
        icon: "icon-area",
        disabled: !1,
        action: y
    },
    {
        title: ("Candlestick view"),
        icon: "icon-candlestick",
        disabled: !1,
        action: y
    },
    {
        title: ("Areaspline view"),
        icon: "icon-area-spline",
        disabled: !0,
        action: y
    },
    {
        title: ("Spline view"),
        icon: "icon-spline",
        disabled: !0,
        action: y
    }],
    a.indicatorConfig = [{
        id: "chart-series",
        type: "sma",
        zIndex: 6,
        params: {
            period: 14
        },
        tooltip: {
            decimals: a.precision
        },
        styles: {
            stroke: "#7ea9c7"
        },
        title: "SMA",
        disabled: !1,
        isActive: !1
    },
    {
        id: "chart-series",
        type: "rsi",
        zIndex: 6,
        params: {
            period: 14,
            overbought: 70,
            oversold: 30,
            decimals: parseInt(a.precision) + 1
        },
        tooltip: {
            decimals: a.precision
        },
        styles: {
            dashstyle: "solid",
            strokeWidth: 1,
            stroke: "#7ec78c"
        },
        yAxis: {
            labels: {
                align: "left",
                x: 5
            },
            opposite: !0,
            plotLines: [{
                value: 70,
                color: "#c7794f",
                width: 1
            },
            {
                value: 30,
                color: "#c7794f",
                width: 1
            }],
            title: {
                text: "RSI",
                style: {
                    color: "#7ec78c"
                }
            }
        },
        title: "RSI",
        disabled: !1,
        isActive: !1
    },
    {
        id: "chart-series",
        type: "bb",
        zIndex: 6,
        tooltip: {
            decimals: a.precision
        },
        topLine: {
            styles: {
                stroke: "#ac7ec7"
            }
        },
        mainLine: {
            styles: {
                stroke: "#ac7ec7"
            }
        },
        bottomLine: {
            styles: {
                stroke: "#ac7ec7"
            }
        },
        title: "Bolinger Bands",
        disabled: !1,
        isActive: !1
    },
    {
        id: "chart-series",
        type: "macd",
        zIndex: 6,
        params: {
            decimals: parseInt(a.precision) + 1
        },
        tooltip: {
            decimals: a.precision
        },
        topLine: {
            styles: {
                stroke: "#c76767"
            }
        },
        mainLine: {
            styles: {
                stroke: "#c76767"
            }
        },
        yAxis: {
            labels: {
                align: "left",
                x: 5
            },
            opposite: !0,
            title: {
                text: "MACD",
                style: {
                    color: "#c76767"
                }
            }
        },
        title: "MACD",
        disabled: !1,
        isActive: !1
    }];
    var symbol = "USEURUSD";
    a.selectInstrument(symbol);


  };
  a.appInit();
}

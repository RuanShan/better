
Ext.define("Trading.view.AdvancedChart", {
    extend: "Ext.window.Window",
    alias: "widget.advancedchart",
    instrumentID: 0,
    time: 0,
    width: 600,
    height: 360,
    resizable: false,
    tplContent: null,
    lineChart: null,
    currentMinute: 0,
    lastQuotes: [],
    lastTradeID: 0,
    tplSocialTrade: null,
    initComponent: function() {
        this.style = {
            opacity: 0.93
        };
        this.bodyStyle = {
            "background-color": Registry.chartConfig.colors.background
        };
        this.currentMinute = Math.floor(this.time / 60000) * 60000;
        this.initTemplates();
        this.html = this.tplContent.apply({
            instrumentID: this.instrumentID
        });
        this.callParent(arguments);
        this.renderCharts()
    },
    initTemplates: function() {
        var a = this;
        this.tplContent = new Ext.XTemplate('<div id="advanced-chart-wrapper-{instrumentID}" class="advanced-chart-wrapper">', '<div class="advanced-chart-options-wrapper">', '<input class=\'{[this.isSocialInstrument(values.instrumentID) ? "" : "x-hidden" ]}\' type="radio" id="advanced-chart-radio-social-{instrumentID}" name="advanced-chart-radio-{instrumentID}" onclick="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').selectChart(\'social\')"><label class=\'{[this.isSocialInstrument(values.instrumentID) ? "" : "x-hidden" ]}\' for="advanced-chart-radio-social-{instrumentID}" id="advanced-chart-label-social-{instrumentID}">' + Registry._["advanced-chart-social"] + "</label>", '<input type="radio" id="advanced-chart-radio-line-{instrumentID}" name="advanced-chart-radio-{instrumentID}" onclick="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').selectChart(\'line\')"><label for="advanced-chart-radio-line-{instrumentID}" id="advanced-chart-label-line-{instrumentID}">' + Registry._["advanced-chart-line"] + "</label>", '<input type="radio" id="advanced-chart-radio-candlestick-{instrumentID}" name="advanced-chart-radio-{instrumentID}" checked=\'checked\' onclick="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').selectChart(\'candlestick\')"><label for="advanced-chart-radio-candlestick-{instrumentID}" id="advanced-chart-label-candlestick-{instrumentID}">' + Registry._["advanced-chart-candlestick"] + "</label>", "</div>", '<div id="advanced-chart-line-{instrumentID}" class="advanced-chart x-hidden"></div>', '<div id="advanced-chart-candlestick-{instrumentID}" class="advanced-chart"></div>', '<div id="advanced-chart-social-trades-container-{instrumentID}" class="x-hidden advanced-chart-social-trades-container" onmouseout="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').contractSocialEntry()">', "<span class=\"advanced-legend-info\" onclick=\"Ext.fly('advanced-chart-social-legend-{instrumentID}').removeCls('x-hidden')\">&nbsp;</span>", '<div id="advanced-chart-social-legend-{instrumentID}" class="advanced-chart-social-legend x-hidden">', "<span class=\"advanced-chart-social-legend-x-icon\" onclick=\"Ext.fly('advanced-chart-social-legend-{instrumentID}').addCls('x-hidden')\">&nbsp;</span>", "<ul>", '<span class="border-label">Social Positions</span>', "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.open.social]}" width="17" height="21" title="Open" alt="Open"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-open-social"]]}</span>', "</li>", "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.close.social]}" width="17" height="21" title="Close" alt="Close"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-close-social"]]}</span>', "</li>", "</ul>", "<ul>", '<span class="border-label">My Positions</span>', "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.open.call]}" title="Call" alt="Call"/>&nbsp;', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.open.put]}" title="Put" alt="Put"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-open-position"]]}</span>', "</li>", "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.inTheMoney.call]}" title="Call" alt="Call"/>&nbsp;', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.inTheMoney.put]}" title="Put" alt="Put"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-in-the-money-position"]]}</span>', "</li>", "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.out.call]}" title="Call" alt="Call"/>&nbsp;', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.out.put]}" title="Put" alt="Put"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-out-of-the-money-position"]]}</span>', "</li>", "<li>", '<span class="advanced-chart-social-legend-icon">', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.at.call]}" title="Call" alt="Call"/>&nbsp;', '<img src="{[Registry.chartConfig.advanced.markers.trades.symbols.at.put]}" title="Put" alt="Put"/>', "</span>", '<span class="advanced-chart-social-legend-label">{[Registry._["markers-legend-label-at-the-money-position"]]}</span>', "</li>", "</ul>", "</div>", '<div class="advanced-chart-social-enable-container {[Registry["socialUser"] ? "x-hidden" : ""]}">', '<div class="advanced-chart-social-enable-mask"></div>', '<div class="advanced-chart-social-enable-msg">', '<a href="' + Registry.socialUrl + '" onclick="return Trading.app.getController(\'User\').forceLogin();">' + Registry._["social-settings-enable-social"] + "</a> " + Registry._["social-enable-social-trades"], "</div>", "</div>", '<div id="advanced-chart-social-trades-panel-{instrumentID}" class="advanced-chart-social-trades-panel empty">', '<span class="advanced-chart-social-trades-empty-label">' + Registry._["social-no-open-trades"] + "</span>", "</div>", "</div>", "</div>", {
            isSocialInstrument: function(b) {
                if (Registry.socialSite && (Registry.socialInstruments.indexOf(b) != -1)) {
                    return true
                }
                return false
            }
        });
        this.tplSocialTrade = new Ext.XTemplate('<div id="advanced-social-trade-{tradeID}" class="advanced-social-trade-entry cf" style="position: relative; display: {[values.isNew ? "none" : "block"]};" onmouseover="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').hoverSocialEntry({tradeID})" onclick="Ext.getCmp(\'advanced-chart-window-{instrumentID}\').selectSocialEntry({tradeID})">', '<div id="trade-entry-status-indicator-{tradeID}" class="trade-entry-status-indicator cf {[this.setIndicatorColor(values)]}">', "<span>&nbsp;</span>", "</div>", '<div class="social-user-img-container"><img id="advanced-social-trade-img-{tradeID}" class="social-user-img" src="{userID:this.setPublicImage}" />', '<img class="social-user-arrow-img" src=\'{[(values.direction == 1) ? "images/small-green-arrow-up-10x11.png" : "images/small-red-arrow-down-10x11.png"]}\' />', "</div>", '<div class="advanced-social-trade-info">', '<span class="advanced-social-trade-info-item">{[this.setInfo(values)]}</span>', "</div>", "</div>", {
            formatDirection: function(b) {
                return (b * 1 == 1) ? "Call": "Put"
            },
            formatStrike: function(b) {
                return b * 1
            },
            formatTime: function(f) {
                var e = new Date();
                var d = new Date(f);
                var g = 60 * 1000;
                var j = g * 60;
                var h = j * 24;
                var c = h * 30;
                var b = h * 365;
                var l = e - d;
                var k;
                if (l < g) {
                    k = Math.round(l / 1000);
                    return (k > 1) ? k + " " + Registry._["short-text-time-seconds-ago"] : k + " " + Registry._["short-text-time-second-ago"]
                } else {
                    if (l < j) {
                        k = Math.round(l / g);
                        return (k > 1) ? k + " " + Registry._["short-text-time-minutes-ago"] : k + " " + Registry._["short-text-time-minute-ago"]
                    } else {
                        if (l < h) {
                            k = Math.round(l / j);
                            return (k > 1) ? k + " " + Registry._["short-text-time-hours-ago"] : k + " " + Registry._["short-text-time-hour-ago"]
                        } else {
                            if (l < c) {
                                return "approximately " + Math.round(l / h) + " " + Registry._["short-text-time-days-ago"]
                            } else {
                                if (l < b) {
                                    return Registry._["short-text-time-approximately"] + " " + Math.round(l / c) + " " + Registry._["short-text-time-months-ago"]
                                } else {
                                    return Registry._["short-text-time-approximately"] + " " + Math.round(l / b) + " " + Registry._["short-text-time-years-ago"]
                                }
                            }
                        }
                    }
                }
            },
            formatInstrument: function(b) {
                return a.title
            },
            setPublicImage: function(b) {
                return Registry.socialImageUrlPattern.replace("[[[userID]]]", b) + "?v=" + Math.floor(new Date().getTime() / 10000)
            },
            getTradeStatus: function(c) {
                var d = {
                    data: c
                };
                var b = Trading.app.getController("Game").getTradeStatus(d, true);
                return b
            },
            setIndicatorColor: function(c) {
                Ext.fly("advanced-chart-social-trades-panel-" + c.instrumentID).removeCls("empty");
                var b = this.getTradeStatus(c);
                return " " + b.status
            },
            setInfo: function(c) {
                var e = this.formatDirection(c.direction);
                var b = this.getTradeStatus(c);
                var d = Registry._["activity-event-open-position"].replace("[[[nickname]]]", "<b>" + c.nickname.trim() + "</b>").replace("[[[option-name]]]", "<b>" + this.formatInstrument(c.instrumentID) + "</b>").replace("[[[option-type]]]", '<span class="' + e.toLowerCase() + '"> ' + Registry._["short-text-binary"] + " " + e + "</span>").replace("[[[expiry]]]", '<span class="' + e.toLowerCase() + '">' + this.formatStrike(c.strike) + "</span>") + '<br /><span id="social-trade-gain-' + c.tradeID + '" class="trade-gain">' + ((b.closed) ? Registry._["short-text-gain"] + ": " + Registry.baseCurrencySymbol + b.payoff + " · ": "") + '</span><span id="social-trade-time-' + c.tradeID + '" class="trade-time">' + this.formatTime(c.timestamp) + '</span> · <a id="like-trade-' + c.tradeID + '" class="loadable like" href="#" onClick="Ext.getCmp(\'advanced-chart-window-' + c.instrumentID + "').like('" + c.tradeID + "','" + c.userID + "'); return false;\">" + Registry._["short-text-like"] + "</a>";
                return d
            }
        })
    },
    like: function(d, a) {
        var b = Ext.fly("like-trade-" + d);
        var c = (b.hasCls("like")) ? "like": "unlike";
        if ((b.hasCls("like"))) {
            b.addCls("loading");
            Ext.Ajax.request({
                url: Registry.uriBase + "/ajax/user/like",
                params: {
                    userID: a,
                    like: c,
                    tradeID: d
                },
                success: function(e) {
                    e = Ext.decode(e.responseText);
                    var f = Ext.fly("like-trade-" + d);
                    f.removeCls("like");
                    f.addCls("liked");
                    f.update("&nbsp;");
                    f.removeCls("loading");
                    e = null
                }
            })
        }
    },
    selectChart: function(a) {
        Ext.fly("advanced-chart-line-" + this.instrumentID).addCls("x-hidden");
        Ext.fly("advanced-chart-candlestick-" + this.instrumentID).addCls("x-hidden");
        if (a == "social") {
            a = "line";
            this.setWidth(860);
            Trading.app.getController("Game").toggleTradesMarkers(true, true, true);
            Ext.fly("advanced-chart-social-trades-container-" + this.instrumentID).removeCls("x-hidden")
        } else {
            this.setWidth(600);
            Trading.app.getController("Game").toggleTradesMarkers(true, true, false);
            Ext.fly("advanced-chart-social-trades-container-" + this.instrumentID).addCls("x-hidden")
        }
        Ext.fly("advanced-chart-" + a + "-" + this.instrumentID).removeCls("x-hidden")
    },
    renderCharts: function() {
        var a = this.instrumentID;
        Ext.Ajax.request({
            url: Registry.uriBase + "/ajax/instrument/history",
            method: "GET",
            params: {
                instruments: Ext.encode([this.instrumentID])
            },
            success: function(b) {
                b = Ext.decode(b.responseText);
                var c = b[a];
                b = null;
                Ext.Ajax.request({
                    url: Registry.uriBase + "/ajax/instrument/history",
                    method: "GET",
                    params: {
                        instruments: Ext.encode([a]),
                        candlesticks: 1,
                        period: 1
                    },
                    success: function(e) {
                        e = Ext.decode(e.responseText);
                        var d = Ext.getCmp("advanced-chart-window-" + a);
                        d.drawCharts(c, e[a]);
                        d.selectChart("candlestick");
                        e = null
                    }
                })
            }
        })
    },
    drawCharts: function(d, b) {
        var c = this.instrumentID;
        var f = this.currentMinute;
        var g = new Date();
        var e = [];
        for (i = 0; (d) && (i < d.length); i++) {
            if (! (i % 5) || !(d[i][0] % 60000)) {
                e.push(d[i])
            }
        }
        var a = new Highcharts.StockChart({
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: Registry.chartConfig.colors.axisgrid,
                lineColor: Registry.chartConfig.colors.axis,
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
                gridLineColor: Registry.chartConfig.colors.axisgrid
            },
            chart: {
                renderTo: "advanced-chart-line-" + c,
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
                id: "advanced-chart-line-series-" + c,
                name: "Price",
                data: e
            }],
            plotOptions: {
                line: {
                    lineWidth: 1,
                    color: Registry.chartConfig.advanced.colors.line,
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
        this.candlestickChart = Trading.app.getController("Game").drawCandlestickChart(c, "advanced-chart-candlestick-", b, e);
        this.markTrades(c, Trading.app.getController("User").trades.data.items);
        this.markSocialTrades(c)
    },
    markSocialTrades: function(c) {
        var a = this;
        var g = Trading.app.getController("Game").charts[c].socialTrades;
        var e;
        var h;
        var b = 0;
        var f;
        var d;
        for (e in g) {
            h = g[e];
            f = h.data.timestamp;
            b += (d) ? (f - d) / 600 : 0;
            new Ext.util.DelayedTask(function(j) {
                a.addSocialEntry(j.trade)
            },
            null, [{
                trade: h
            }]).delay(b);
            d = f
        }
    },
    addSocialEntry: function(e) {
        var d = e.data;
        var c = d.tradeID;
        var a = this.instrumentID;
        if (this.tradesMarkers && !Ext.isEmpty(this.tradesMarkers[c])) {
            return
        }
        d.isNew = true;
        this.tplSocialTrade.insertFirst("advanced-chart-social-trades-panel-" + a, d);
        Ext.fly("advanced-chart-social-trades-panel-" + a).scrollTo("top", 0, false);
        var b = Ext.get("advanced-social-trade-" + c);
        b.setOpacity(0.25, false);
        b.slideIn("t", {
            duration: 200,
            useDisplay: true,
            easing: "ease",
            callback: function() {
                b.fadeIn({
                    opacity: 1,
                    duration: 1000,
                    callback: function() {
                        b.setHeight("auto");
                        b.setWidth("auto")
                    }
                })
            }
        });
        this.markTrades(a, [e])
    },
    contractSocialEntry: function() {
        if (this.tradesMarkers) {
            var a = true;
            Ext.each(Ext.query(".advanced-social-trade-entry"),
            function(c) {
                Ext.fly(c.id).removeCls("active");
                if (Ext.fly(c.id).hasCls("selected")) {
                    a = false
                }
            });
            if (a) {
                for (var b in this.tradesMarkers) {
                    break
                }
                this.selectTradeMarker(b, false)
            }
        }
    },
    hoverSocialEntry: function(g) {
        var b = this;
        var f = Ext.fly("advanced-social-trade-" + g);
        var c = f.hasCls("active");
        var e = f.hasCls("disabled");
        var d = f.hasCls("selected");
        if (e) {
            return
        }
        if (!c) {
            var a = true;
            Ext.each(Ext.query(".advanced-social-trade-entry"),
            function(h) {
                Ext.fly(h.id).removeCls("active");
                if (Ext.fly(h.id).hasCls("selected")) {
                    a = (false || d)
                }
            });
            Ext.fly("advanced-social-trade-" + g).addCls("active");
            if (a) {
                b.selectTradeMarker(g, true)
            }
        }
    },
    selectSocialEntry: function(e) {
        var a = this;
        var d = Ext.fly("advanced-social-trade-" + e);
        var c = d.hasCls("selected");
        var b = d.hasCls("disabled");
        if (b) {
            return
        }
        if (c) {
            d.removeCls("selected")
        } else {
            Ext.each(Ext.query(".advanced-social-trade-entry.selected"),
            function(f) {
                Ext.fly(f.id).removeCls("selected")
            });
            Ext.fly("advanced-social-trade-" + e).addCls("selected");
            a.selectTradeMarker(e, true)
        }
    },
    removeSocialEntry: function(b, a) {
        if (this.tradesMarkers[b.data.tradeID]) {
            this.tradesMarkers[b.data.tradeID].marker = {
                enabled: false
            }
        }
        if (a) {
            Ext.fly("advanced-social-trade-" + b.data.tradeID).addCls("disabled")
        } else {
            Ext.get("advanced-social-trade-" + b.data.tradeID).remove()
        }
    },
    updateSocialEntry: function(c) {
        var b = c.data.tradeID;
        var d = Trading.app.getController("Game");
        var a = d.getTradeStatus(c, true);
        if (a.closed) {
            Ext.fly("trade-entry-status-indicator-" + b).addCls(a.status);
            if (Ext.fly("social-trade-gain-" + b)) {
                Ext.fly("social-trade-gain-" + b).update(Registry._["short-text-gain"] + ": " + Registry.baseCurrencySymbol + a.payoff + " · ")
            }
        }
    },
    updateSocialEntryTimes: function() {
        var a = this;
        var d = Trading.app.getController("Game").charts[a.instrumentID].socialTrades;
        var b;
        var e;
        var c;
        for (b in d) {
            e = d[b];
            c = e.data.timestamp;
            if (Ext.fly("social-trade-time-" + b)) {
                Ext.fly("social-trade-time-" + b).update(a.tplSocialTrade.formatTime(c))
            }
        }
    },
    quote: function(j, m, h, n) {
        m = m * 1;
        var g = Trading.app.getController("Game");
        var f = this.instrumentID;
        if (this.lastQuotes[f] && (j - this.lastQuotes[f] < Registry.chartUpdateFrequency)) {
            return
        }
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
            g.fixTradesMarkersPosition(true);
            g.setTradesMarkersVisibility(g.showTradesMarkers.myTrades, false, true);
            g.setTradesMarkersVisibility((this.width == 860), true, true);
            this.lastTradeID = n
        }
        Trading.app.getController("Game").addPointToCandlestickChart(f, k, j, m)
    },
    markTrades: function(g, m) {
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
    selectTradeMarker: function(c, b) {
        if (this.tradesMarkers) {
            var a = this.tradesMarkers[c];
            if (a && a.marker) {
                a.select(b, true)
            }
        }
    },
    updateTradeMarker: function(c) {
        var d = Trading.app.getController("Game");
        var b = c.data.tradeID;
        var a = d.getTradeStatus(c, true);
        if (Ext.fly("advanced-trade-marker-symbol-" + b)) {
            Ext.fly("advanced-trade-marker-symbol-" + b).dom.setAttribute("href", a.symbol)
        }
    }
});
Ext.define("Trading.controller.Game", {
    extend: "Ext.app.Controller",
    time: 0,
    instruments: null,
    page: 1,
    pageSize: 4,
    numOfPages: 1,
    gameTemplateFunctions: null,
    tplGame: null,
    tplGameClosed: null,
    tplSmallGame: null,
    tplSmallGameClosed: null,
    tplFinancialView: null,
    tplGames: null,
    tplInvoice: null,
    tplSixtySecondsInvoice: null,
    tplPayouts: null,
    tplMore: null,
    tplSentiment: null,
    tplProgressBar: null,
    tplPagination: null,
    selectedGameTemplate: null,
    selectedGameID: null,
    selectedChartType: null,
    chartTypeCookieKey: "financialViewChartType",
    firstLoading: true,
    firstRendering: true,
    dateHelperExpiry: null,
    currentFilter: "featured",
    counters: null,
    selectedExpiries: null,
    progressUpdates: null,
    locked: null,
    charts: null,
    candlestickCharts: null,
    chartUpdater: null,
    sentiment: null,
    lastQuotes: [],
    featured: null,
    starred: null,
    showTradesMarkers: {
        myTrades: true,
        social: true
    },
    instrumentInvestmentLimits: {},
    expiryData: {},
    selectedShortExpiryOption: {},
    selectedGameTypes: {},
    zoomLevels: [60, 30, 15],
    regularZoomLevels: [60, 30, 15],
    weekendZoomLevels: [120, 60, 30],
    zoomLevelIndex: 0,
    currentMinute: 0,
    chartsRendered: false,
    instrumentHideConfirmationTasks: {},
    tradeHideConfirmationTasks: {},
    views: ["AdvancedChart"],
    practiceMode: null,
    showGameInfo: null,
    init: function() {
        var b = "gameTemplate";
        var c = Utils.getCookie(b);
        this.practiceMode = Registry.practiceMode ? 1 : 0;
        this.showGameInfo = Registry.displayGameInfo;
        if (!c || (c === "financial" && !(Registry.financialViewConfig.enabled * 1)) || ["small", "regular", "financial"].indexOf(c) === -1) {
            this.selectedGameTemplate = Registry.defaultGameTemplate
        } else {
            this.selectedGameTemplate = c
        }
        var d = Utils.getCookie(this.chartTypeCookieKey);
        if (!d || ["line", "candelstick"].indexOf(d) === -1) {
            this.selectedChartType = Registry.financialViewConfig.defaultChartType
        } else {
            this.selectedChartType = d
        }
        this.time = Registry.time;
        this.dateHelperExpiry = new Date(this.time);
        this.currentMinute = Math.floor(this.time / 60000) * 60000;
        this.initTemplates();
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        this.showTradesMarkers.myTrades = Registry.chartConfig.markers.myTrades.show;
        this.showTradesMarkers.social = Registry.chartConfig.markers.social.show;
        var a = this;
        $(".tpl-select-option").click(function() {
            $(".tpl-select-option").removeClass("active"),
            $(this).addClass("active");
            a.selectedGameTemplate = $(this).attr("game-tpl");
            Utils.setCookie(b, a.selectedGameTemplate, 365, "/");
            a.renderGames()
        });
        $('.tpl-select-option[game-tpl="' + this.selectedGameTemplate + '"]').addClass("active")
    },
    render: function() {
        this.selectedExpiries = {};
        this.progressUpdates = {};
        this.locked = {};
        this.charts = {};
        this.candlestickCharts = {};
        if (!this.instruments) {
            this.instruments = Ext.create("Ext.data.Store", {
                model: "Trading.model.Instrument"
            })
        }
        this.instruments.loadData(Trading.app.getController("Instrument").instruments.data.items);
        var a = false;
        if (this.instruments.data.items.length == 0) {
            this.instruments = Ext.create("Ext.data.Store", {
                model: "Trading.model.Instrument"
            });
            this.instruments.loadData(Trading.app.getController("Instrument").instruments.data.items);
            a = true
        }
        this.instruments.each(function(d) {
            var c = d.data.instrumentID;
            d.data.featured = Ext.Array.contains(Registry.featured, c);
            d.data.starred = Ext.Array.contains(Registry.starred, c)
        });
        if (a) {
            var b = (Ext.isArray(this.currentFilter)) ? this.currentFilter: [{
                property: this.currentFilter,
                value: true
            }];
            this.instruments.filter(b)
        }
        if (this.firstLoading) {
            this.instruments.filter([{
                property: "featured",
                value: true
            }]);
            this.firstLoading = false
        }
        if (this.currentFilter) {
            this.instruments.sort([{
                property: "isOpen",
                direction: "DESC"
            },
            {
                property: "order",
                direction: "ASC"
            },
            {
                property: "name",
                direction: "ASC"
            }])
        } else {
            this.instruments.sort([{
                property: "isOpen",
                direction: "DESC"
            },
            {
                property: "name",
                direction: "ASC"
            }])
        }
        this.calcNumOfPages();
        this.renderPagination();
        this.renderGames();
        this.firstRendering = false
    },
    renderGames: function() {
        var b = Registry.featured.slice(0);
        var d = Registry.starred.slice(0);
        var m;
        var h = [];
        var k = [];
        var j;
        var e;
        this.featured = [];
        this.starred = [];
        if (this.currentFilter == "featured") {
            for (j in b) {
                m = this.instruments.getById(b[j]);
                if (m) {
                    if (m.data.isOpen) {
                        h.push(b[j])
                    } else {
                        k.push(b[j])
                    }
                }
            }
            this.featured = h.concat(k)
        } else {
            if (this.currentFilter == "starred") {
                this.starred = [];
                for (e in d) {
                    m = this.instruments.getById(d[e]);
                    if (m) {
                        this.starred.push(d[e])
                    }
                }
            }
        }
        var f = this.getGames();
        if (!f.length) {
            $("#games-wrapper").hide();
            return
        } else {
            $("#games-wrapper").show()
        }
        if (this.selectedGameTemplate == "regular") {
            this.tplGames.overwrite("games-wrapper", f);
            $("#pagination-wrapper").css("display", "block")
        } else {
            if (this.selectedGameTemplate == "small") {
                var c = [];
                for (var g = 0; g < f.length; g++) {
                    if (!c.length || c[c.length - 1].length == 2) {
                        c.push([])
                    }
                    c[c.length - 1].push(f[g])
                }
                this.tplSmallGameContainers.overwrite("games-wrapper", c);
                $("#pagination-wrapper").css("display", "block")
            } else {
                if (this.selectedGameTemplate == "financial") {
                    this.tplFinancialView.overwrite("games-wrapper", f);
                    if (!f.length) {
                        $("#expiry-container").hide();
                        $("#chart-container").hide();
                        $("#closed-game-container").hide()
                    } else {
                        this.selectedGameID = f[0].data.instrumentID;
                        if (!f[0].data.isOpen) {
                            $("#expiry-container").hide();
                            $("#chart-container").hide();
                            $("#closed-game-container").show()
                        }
                        $(".nano").nanoScroller();
                        var l = {
                            header: "ui-icon-circle-plus",
                            activeHeader: "ui-icon-circle-minus"
                        };
                        $("#accordion").accordion({
                            collapsible: true,
                            heightStyle: "content",
                            icons: l,
                            beforeActivate: function(q, r) {
                                if (!r.newHeader.attr("id")) {
                                    return
                                }
                                var p = r.newHeader.attr("id").substr(5);
                                var s = Trading.app.getController("Game");
                                var o = null;
                                var n = s.getGameType(p);
                                s.instruments.getById(p).payouts().each(function(t) {
                                    if (n == t.data.gameType) {
                                        o = t.data.payout + "-" + t.data.rebate
                                    }
                                });
                                s.selectPayout(p, o, true);
                                if (s.showGameInfo) {
                                    $(".instrument-desc").removeAttr("tooltip-content")
                                }
                            },
                            activate: function(q, s) {
                                if (!s.newHeader.attr("id")) {
                                    return
                                }
                                var p = s.newHeader.attr("id").substr(5);
                                var u = Trading.app.getController("Game");
                                u.selectedGameID = p;
                                var n = u.instruments.getById(p);
                                var o = u.tplFinancialViewChartWrapper;
                                o.overwrite("chart-wrapper", n.data);
                                u.renderCharts([n]);
                                var t = u.tplFinancialViewGameExpiry;
                                t.overwrite("financial-game-expiry-wrapper", n.data);
                                u.renderExpiryBoxes(p);
                                u.renderSentiment();
                                if (!n.data.isOpen) {
                                    var r = u.tplFinancialViewGameClosed;
                                    r.overwrite("closed-game-wrapper", n.data);
                                    $("#expiry-container").hide();
                                    $("#chart-container").hide();
                                    $("#closed-game-container").show()
                                } else {
                                    $("#closed-game-container").hide();
                                    $("#expiry-container").show();
                                    $("#chart-container").show()
                                }
                                if (u.showGameInfo) {
                                    $(".instrument-desc").tooltip({
                                        position: {
                                            my: "left-50 top+15",
                                            collision: "none"
                                        },
                                        items: "[tooltip-content]",
                                        tooltipClass: "game-tooltip instrument-desc-tooltip"
                                    });
                                    $(".ask-bid-desc").tooltip({
                                        position: {
                                            my: "right+80 bottom-30",
                                            collision: "none"
                                        },
                                        items: "[tooltip-content]",
                                        tooltipClass: "game-tooltip ask-bid-desc-tooltip"
                                    })
                                }
                            }
                        });
                        $(".sortable-list").sortable({
                            stop: function(p, q) {
                                if (Trading.app.getController("Game").currentFilter != "starred") {
                                    return
                                }
                                var n = [];
                                var r = $("#accordion > li > h3");
                                for (var o = 0; o < r.length; o++) {
                                    n.push($(r[o]).attr("id").substr(5))
                                }
                                Registry.starred = n;
                                n = n.join();
                                Ext.Ajax.request({
                                    url: Registry.uriBase + "/ajax/user/set-favorites",
                                    method: "GET",
                                    params: {
                                        instrumentIDs: n
                                    },
                                    success: function(s) {
                                        s = Ext.decode(s.responseText)
                                    }
                                })
                            }
                        });
                        f = [f[0]];
                        $("#pagination-wrapper").css("display", "none")
                    }
                }
            }
        }
        if (f.length > 1) {
            this.renderExpiryBoxes()
        } else {
            this.renderExpiryBoxes(f[0].data.instrumentID)
        }
        var a = new Ext.util.DelayedTask(function() {
            Trading.app.getController("Game").renderCharts(f)
        });
        a.delay(50);
        this.renderSentiment();
        if (this.showGameInfo) {
            $(".instrument-desc").tooltip({
                position: {
                    my: "left-50 top+15",
                    collision: "none"
                },
                items: "[tooltip-content]",
                tooltipClass: "game-tooltip instrument-desc-tooltip"
            });
            $(".ask-bid-desc").tooltip({
                position: {
                    my: "right+130 bottom-30",
                    collision: "none"
                },
                items: "[tooltip-content]",
                tooltipClass: "game-tooltip ask-bid-desc-tooltip"
            })
        }
    },
    renderGamesLite: function() {
        var d = this.getGames();
        var a = [];
        var c = this;
        if (this.selectedGameTemplate === "financial") {
            var b = false;
            Ext.each(d,
            function(e) {
                var h = "game-container-" + e.data.instrumentID;
                if (!Ext.fly(h)) {
                    console.log("Error: Object with id " + h + " doesn't exist");
                    return
                }
                var g = e.data.isOpen;
                var f = Ext.fly(h).dom.getAttribute("data-state");
                if ((g && (f != "open")) || (!g && (f != "closed"))) {
                    b = true
                }
            });
            if (b) {
                this.render()
            }
            this.renderExpiryBoxes()
        } else {
            Ext.each(d,
            function(e) {
                var l = "game-container-" + e.data.instrumentID;
                if (!Ext.fly(l)) {
                    console.log("Error: Object with id " + l + " doesn't exist");
                    return
                }
                var g;
                var k = false;
                var h = e.data.isOpen;
                var f = Ext.fly(l).dom.getAttribute("data-state");
                var j;
                k = ((h && (f != "open")) || (!h && (f != "closed")));
                if (k) {
                    if (c.selectedGameTemplate == "regular") {
                        g = (h) ? c.tplGame: c.tplGameClosed
                    } else {
                        if (c.selectedGameTemplate == "small") {
                            g = (h) ? c.tplSmallGame: c.tplSmallGameClosed
                        } else {
                            if (c.selectedGameTemplate == "financial") {
                                g = (h) ? c.tplFinancialViewGame: c.tplFinancialViewGameClosed;
                                g = c.tplFinancialViewGame
                            }
                        }
                    }
                    g.overwrite(l, e.data);
                    j = Ext.getDom(l);
                    if (j) {
                        j.setAttribute("data-state", (h) ? "open": "closed");
                        j.removeAttribute("data-disabled")
                    }
                    if (Ext.fly(l)) {
                        Ext.fly(l).removeCls("disabled")
                    }
                    if (h) {
                        a.push(e)
                    }
                }
            });
            this.renderExpiryBoxes();
            if (a.length) {
                this.renderCharts(a)
            }
        }
    },
    getGames: function() {
        var f = ((this.page - 1) * this.pageSize);
        var e = f + this.pageSize - 1;
        var d = [];
        var a;
        if (this.currentFilter == "featured") {
            if (this.selectedGameTemplate == "regular" || this.selectedGameTemplate == "small") {
                var c = this.featured.slice(f, e + 1)
            } else {
                var c = this.featured
            }
            var b;
            for (b in c) {
                a = this.instruments.getById(c[b]);
                if (a) {
                    d.push(a)
                }
            }
        } else {
            if (this.currentFilter == "starred") {
                if (this.selectedGameTemplate == "regular" || this.selectedGameTemplate == "small") {
                    var c = this.starred.slice(f, e + 1)
                } else {
                    var c = this.starred
                }
                var b;
                for (b in c) {
                    a = this.instruments.getById(c[b]);
                    if (a) {
                        d.push(a)
                    }
                }
            } else {
                if (this.selectedGameTemplate == "regular" || this.selectedGameTemplate == "small") {
                    d = this.instruments.getRange(f, e)
                } else {
                    d = this.instruments.getRange()
                }
            }
        }
        return d
    },
    renderExpiryBoxes: function(g) {
        var e = this.time;
        var f = (g) ? [this.instruments.getById(g)] : this.getGames();
        var b = (2 * 60000);
        var c = (15 * 60000);
        var l = (10 * 60000);
        var n = e - (e % c);
        var m = this.firstRendering;
        var k = -1;
        if ((n + c - e) < l) {
            k = n + c;
            n += c
        } else {
            if (e - n < b) {
                k = n
            }
        }
        var o = this.formatExpiry(n);
        var d;
        var a;
        var h;
        var j = Trading.app.getController("Game");
        Ext.each(f,
        function(L) {
            var C = Trading.app.getController("Game");
            var H = "game-expiry-box-" + L.data.instrumentID;
            var t = [];
            var z;
            var p;
            var D;
            var E;
            var y = false;
            var B;
            var G = C.getGameType(L.data.instrumentID);
            if (G == "11") {
                G = "1"
            }
            var u = 0;
            var I = null;
            var s;
            var K = C.selectedShortExpiryOption[L.data.instrumentID];
            if (typeof(K) === "undefined") {
                K = 1;
                C.selectedShortExpiryOption[L.data.instrumentID] = K
            }
            var x = Registry.longTermGames.indexOf(L.data.instrumentID + "") > -1;
            switch (G) {
            case "2":
                if (Registry.instrumentExpiries[L.data.instrumentID] && Registry.instrumentExpiries[L.data.instrumentID]["expiry_sixty_second"]) {
                    I = Registry.instrumentExpiries[L.data.instrumentID]["expiry_sixty_second"]
                } else {
                    I = Registry.expiries.expiry_sixty_second
                }
                break;
            case "7":
                d = [Registry.weekendOptionExpiryTimestamp];
                break;
            default:
                if (Registry.instrumentExpiries[L.data.instrumentID] && Registry.instrumentExpiries[L.data.instrumentID]["expiry_high_low"]) {
                    I = Registry.instrumentExpiries[L.data.instrumentID]["expiry_high_low"]
                } else {
                    I = Registry.expiries.expiry_high_low
                }
                break
            }
            if (G == "2") {
                $("#game-expiry-box-" + L.data.instrumentID).hide();
                $("#game-expiry-label-" + L.data.instrumentID).hide();
                $("#game-short-expiry-options-" + L.data.instrumentID).show();
                $("#game-short-expiry-tooltip-" + L.data.instrumentID).show();
                $("#game-short-expiry-tooltip-arrow-" + L.data.instrumentID).show()
            } else {
                $("#game-short-expiry-options-" + L.data.instrumentID).hide();
                $("#game-short-expiry-tooltip-" + L.data.instrumentID).hide();
                $("#game-short-expiry-tooltip-arrow-" + L.data.instrumentID).hide();
                $("#game-expiry-box-" + L.data.instrumentID).show();
                $("#game-expiry-label-" + L.data.instrumentID).show()
            }
            j.expiryData[L.data.instrumentID] = {};
            var q = $("#game-short-expiry-options-" + L.data.instrumentID);
            q.empty();
            var w;
            var v;
            if (I) {
                d = [];
                for (h = 0; h < I.length; h++) {
                    n = e - e % (I[h].round * 1000);
                    s = n + I[h].expiry * 1000;
                    if (s - e > I[h].deadPeriod * 1000 || G == "2") {
                        if ($.inArray(s, d) == -1) {
                            d.push(s);
                            j.expiryData[L.data.instrumentID][s] = {
                                expiry: I[h].expiry * 1000,
                                deadPeriod: I[h].deadPeriod * 1000
                            }
                        }
                    }
                    if (G == "2") {
                        v = I[h].deadPeriod;
                        if (v * 1 <= 60) {
                            v += "Sec"
                        } else {
                            v /= 60;
                            v += "min"
                        }
                        q.append('<li class="short-expiry-option-' + h + '" ><div class="short-expiry-text" onclick="Trading.app.getController(\'Game\').selectShortExpiryOption(' + L.data.instrumentID + ", " + s + ", " + h + ');">' + v + "</div></li>");
                        if (h == K) {
                            w = s
                        }
                    }
                }
            }
            if (G == "2") {
                C.selectShortExpiryOption(L.data.instrumentID, w, K)
            }
            if (G == "1" && x) {
                d.push("long-term-divider");
                d.push.apply(d, Registry.longTermOptionExpiryTimestamps)
            }
            a = [];
            for (h = 0; h < d.length; h++) {
                if (d[h] == "long-term-divider") {
                    d[h] = "";
                    var r = " " + Registry._["long-term"] + " ";
                    var J = (23 - r.length) / 2;
                    var F;
                    for (F = 0; F < J; F++) {
                        r = "-" + r + "-"
                    }
                    a[h] = r
                } else {
                    a[h] = C.formatExpiry(d[h])
                }
            }
            if (Ext.fly(H)) {
                D = Ext.fly(H).getValue();
                if (G == "2") {
                    D = w
                }
                u = $("#" + H)[0].options.length;
                E = D;
                for (h = 0; h < d.length; h++) {
                    z = d[h];
                    p = a[h];
                    B = false;
                    if (G == 2) {
                        G = 1
                    }
                    if (G == 7 || z == "") {
                        B = true
                    } else {
                        if (Registry.longTermOptionExpiryTimestamps.indexOf(z) > -1) {
                            if (z - j.time > 7200000) {
                                B = true
                            }
                        } else {
                            L.tradingHours().each(function(M) {
                                if (M.data.gameType == G) {
                                    M.tradingHourRanges().each(function(O) {
                                        var Q = O.data.from;
                                        var P = O.data.to;
                                        var N = false;
                                        if (z <= Q) {
                                            N = true
                                        } else {
                                            if (z > Q && z <= P) {
                                                B = true;
                                                N = true
                                            }
                                        }
                                        return ! N
                                    })
                                }
                            })
                        }
                    }
                    if (B) {
                        if ((D == "") || ((!y) && (D < z) && Registry.longTermOptionExpiryTimestamps.indexOf(D * 1) == -1)) {
                            D = z
                        }
                        if (D == z) {
                            y = true
                        }
                        t.push({
                            timestamp: z,
                            expiry: p,
                            selected: (D == z)
                        })
                    }
                }
                if (Ext.isEmpty(t)) {
                    t.push({
                        timestamp: n,
                        expiry: o,
                        selected: true
                    });
                    C.disableGame(L.data.instrumentID)
                }
                var A = Ext.get(H).dom;
                A.options.length = 0;
                y = false;
                for (h = 0; h < t.length; h++) {
                    if (t[h].selected) {
                        y = true;
                        break
                    }
                }
                for (h = 0; h < t.length; h++) {
                    if ((m) && (!y) && ((t[h].timestamp - e) > 120000)) {
                        t[h].selected = true;
                        y = true
                    }
                    A.options[h] = new Option(t[h].expiry, t[h].timestamp, t[h].selected, t[h].selected);
                    if (t[h].timestamp == "") {
                        A.options[h].setAttribute("disabled", "disabled")
                    }
                }
                C.selectExpiry(L.data.instrumentID, Ext.fly(H).getValue(), Registry.chartConfig.leftToRight * 1 && E && (D != E || u != A.options.length))
            }
        })
    },
    isValidExpiry: function(a, e) {
        a *= 1;
        e *= 1;
        var d;
        var g = this.time;
        var c;
        var f;
        var b;
        if (a === 1) {
            b = Registry.expiries.expiry_high_low
        } else {
            b = Registry.expiries.expiry_sixty_second
        }
        for (d = 0; d < b.length; d++) {
            c = g - g % (b[d].round * 1000);
            f = c + b[d].expiry * 1000;
            if (e === f && f - g > b[d].deadPeriod * 1000) {
                return true
            }
        }
        return false
    },
    selectShortExpiryOption: function(e, d, h) {
        var c = $("#game-expiry-box-" + e);
        if (!c.length) {
            return
        }
        c.val(d);
        this.selectedShortExpiryOption[e] = h;
        var f = $("#game-short-expiry-options-" + e + " > li");
        f.removeClass("active");
        $("#game-short-expiry-options-" + e + " > .short-expiry-option-" + h).addClass("active");
        var j = this.expiryData[e][d].deadPeriod / 1000;
        if (j * 1 <= 60) {
            j = Registry._["game-type-name-60-sec"].replace("60", j)
        } else {
            j /= 60;
            j += " min"
        }
        $("#game-type-" + e + "-2 > a > strong").html(j);
        var k = $("#game-short-expiry-tooltip-" + e);
        k.html(this.formatExpiry(d));
        var g = $("#game-short-expiry-options-" + e).width();
        k.css("margin-left", -g + "px");
        k.width(g);
        var b = $("#game-short-expiry-tooltip-arrow-" + e);
        var a = -g + $("#game-short-expiry-options-" + e + " .short-expiry-option-" + h).offset().left - $("#game-short-expiry-options-" + e + " .short-expiry-option-0").offset().left - (12 - $("#game-short-expiry-options-" + e + " .short-expiry-option-" + h).width()) / 2;
        b.css("margin-left", a);
        this.selectExpiry(e + "", d, false)
    },
    isWeekendOptionEnabled: function(a) {
        if (Registry.weekendGames.indexOf(a.data.instrumentID) == -1) {
            return false
        }
        var b = false;
        var c = this.time;
        a.tradingHours().each(function(d) {
            if (d.data.gameType == "7") {
                d.tradingHourRanges().each(function(e) {
                    var g = e.data.from;
                    var f = e.data.to;
                    if (c > g && c <= f) {
                        b = true
                    }
                })
            }
        });
        return b
    },
    selectExpiry: function(f, d, k) {
        var h = Trading.app.getController("Game");
        var r = this.getGameType(f);
        var m;
        if (r == 1 || r == 11) {
            if (Registry.longTermOptionExpiryTimestamps.indexOf(d * 1) > -1) {
                m = 11
            } else {
                m = 1
            }
            if (r != m) {
                r = m;
                this.setGameType(f, r, true)
            }
        }
        this.selectedExpiries[f] = d;
        var o = false;
        var c;
        var e;
        if (h.expiryData[f] && h.expiryData[f][d]) {
            o = true;
            c = d - h.expiryData[f][d].expiry;
            e = d - h.expiryData[f][d].deadPeriod
        }
        if (o && this.time >= c && this.time < e) {
            if (this.progressUpdates[f]) {
                delete this.progressUpdates[f]
            }
            Ext.fly("progress-bar-text-" + f + "-top").dom.innerHTML = "";
            Ext.fly("progress-bar-text-" + f + "-bottom").dom.innerHTML = "";
            Ext.fly("progress-bar-" + f + "-value").setWidth(0);
            Ext.fly("closing-progress-bar-container-" + f).removeCls("x-hidden");
            if (Ext.fly("time-to-trade-label-" + f)) {
                Ext.fly("time-to-trade-label-" + f).removeCls("x-hidden")
            }
            this.progressUpdates[f] = {
                from: c,
                to: e
            };
            this.updateProgress();
            Ext.getDom("game-" + f).setAttribute("enabled", "true")
        } else {
            Ext.fly("closing-progress-bar-container-" + f).addCls("x-hidden");
            if (Ext.fly("time-to-trade-label-" + f)) {
                Ext.fly("time-to-trade-label-" + f).addCls("x-hidden")
            }
            delete this.progressUpdates[f];
            if (this.getGameType(f) != "7" && this.getGameType(f) != "11") {
                Ext.getDom("game-" + f).setAttribute("enabled", "false")
            } else {
                Ext.getDom("game-" + f).setAttribute("enabled", "true")
            }
        }
        if (Ext.fly("invoice-" + f).dom.getAttribute("data-active") == "true") {
            if (Ext.fly("game-" + f).dom.getAttribute("data-expiry") != d) {
                this.showInvoice(f)
            }
        }
        if (this.selectedGameTemplate === "financial") {
            var l = null;
            this.instruments.getById(f).payouts().each(function(s) {
                if (r == s.data.gameType) {
                    l = s.data.payout + "-" + s.data.rebate
                }
            });
            this.selectPayout(f, l)
        } else {
            var j = Ext.get("payouts-" + f).dom;
            var a = j.selectedIndex;
            var q = j.options[j.selectedIndex].value;
            var b = j.options[a].value;
            var n = -1;
            var p = -1;
            while (j.options.length) {
                j.options.remove(0)
            }
            this.instruments.getById(f).payouts().each(function(s) {
                if (r == s.data.gameType) {
                    s.payoutRanges().each(function(t) {
                        j.options.add(new Option(t.data.payout + "% / " + t.data.rebate + "%", t.data.payout + "-" + t.data.rebate));
                        if (s.data.payout == t.data.payout && s.data.rebate == t.data.rebate) {
                            p = t.data.payout + "-" + t.data.rebate
                        }
                    })
                }
            });
            if (j.options.length && j.options.length > a && q == j.options[a].value) {
                j.selectedIndex = a
            } else {
                var g;
                for (g = 0; g < j.options.length; g++) {
                    if (b == j.options[g].value) {
                        n = g;
                        break
                    }
                }
                if (n > -1) {
                    j.selectedIndex = n
                } else {
                    for (g = 0; g < j.options.length; g++) {
                        if (p == j.options[g].value) {
                            n = g;
                            break
                        }
                    }
                    j.selectedIndex = n
                }
            }
            this.selectPayout(f, j.options[j.selectedIndex].value)
        }
        if (k) {
            this.updateChartRange(f)
        }
    },
    updateChartZoomRange: function(b) {
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
    },
    updateChartRange: function(a) {
        var c = this.charts[a];
        if (!c) {
            return
        }
        var e = c.get("chart-x-axis-" + a);
        e.removePlotLine("chart-dead-period-line-" + a);
        e.removePlotLine("chart-expiry-line-" + a);
        if (Registry.chartConfig.leftToRight * 1 && this.getGameType(a) == 1) {
            var d = "game-expiry-box-" + a;
            var b = Ext.fly(d).getValue() * 1;
            e.addPlotLine({
                id: "chart-dead-period-line-" + a,
                value: b - (10 * 60000),
                color: Registry.chartConfig.colors.guide,
                width: 1,
                dashStyle: "shortdash",
                label: {
                    text: "Time To Invest"
                },
                zIndex: 1
            });
            e.addPlotLine({
                id: "chart-expiry-line-" + a,
                value: b,
                color: Registry.chartConfig.colors.guide,
                width: 1,
                label: {
                    text: "Expiration"
                },
                zIndex: 1
            });
            e.setExtremes(null, b + 10 * 60000)
        } else {
            e.setExtremes(null, null)
        }
    },
    updateProgress: function() {
        var d;
        var l;
        var m;
        var e;
        var b;
        var a;
        var g;
        var j = 148;
        var f;
        var h;
        var c;
        var k;
        for (d in this.progressUpdates) {
            l = this.progressUpdates[d]["from"];
            m = this.progressUpdates[d]["to"];
            g = m - l;
            if (this.time >= l && this.time < m) {
                b = (this.time - l);
                e = (m - this.time) + 1000;
                var n = Ext.fly("progress-bar-" + d);
                if (!n) {
                    return
                }
                j = n.getWidth() - 6;
                a = Math.ceil(b * j / g);
                e = Math.floor(e / 1000);
                c = Math.floor(e / 60);
                if (c < 60) {
                    k = e % 60;
                    if (c < 10) {
                        c = "0" + c
                    }
                    if (k < 10) {
                        k = "0" + k
                    }
                    f = c + ":" + k
                } else {
                    h = Math.floor(c / 60);
                    c = c % 60;
                    if (h < 10) {
                        h = "0" + h
                    }
                    if (c < 10) {
                        c = "0" + c
                    }
                    f = h + ":" + c
                }
                Ext.fly("progress-bar-text-" + d + "-top").dom.innerHTML = f;
                Ext.fly("progress-bar-text-" + d + "-bottom").dom.innerHTML = f;
                Ext.fly("progress-bar-" + d + "-value").setWidth(a)
            } else {
                if (this.time >= m) {
                    delete this.progressUpdates[d]
                }
            }
        }
    },
    drawCandlestickChart: function(c, j, b, a) {
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
    },
    addPointToCandlestickChart: function(d, c, h, f) {
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
    },
    renderCharts: function(b) {
        this.chartsRendered = false;
        this.charts = {};
        this.candlestickCharts = {};
        var a = [];
        Ext.each(b,
        function(c) {
            if (c.data.isOpen) {
                a.push(c.data.instrumentID)
            }
        });
        Ext.Ajax.request({
            url: Registry.uriBase + "/ajax/instrument/history",
            method: "GET",
            params: {
                instruments: Ext.encode(a)
            },
            success: function(c) {
                c = Ext.decode(c.responseText);
                var d = Trading.app.getController("Game");
                d.drawCharts(b, c);
                d.startChartUpdater();
                if (Registry.socialSite) {
                    d.startSocialObserver()
                }
                d.chartsRendered = true;
                c = null;
                d = null
            }
        })
    },
    drawCharts: function(h, d) {
        var f = new Date();
        var b = "";
        var g = {};
        var e = Registry.chartConfig.colors.line;
        if (Registry.chartConfig.colors.fillColor.top && Registry.chartConfig.colors.fillColor.bottom) {
            b = "areaspline";
            g = {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [[0, Registry.chartConfig.colors.fillColor.top], [1, Registry.chartConfig.colors.fillColor.bottom]]
            }
        }
        var a = Registry.chartConfig.colors.axisLabel ? {
            color: Registry.chartConfig.colors.axisLabel
        }: {};
        var c;
        if (Registry.chartConfig.colors.plotBackgroundGradient.top && Registry.chartConfig.colors.plotBackgroundGradient.bottom) {
            c = {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [[0, Registry.chartConfig.colors.plotBackgroundGradient.top], [1, Registry.chartConfig.colors.plotBackgroundGradient.bottom]]
            }
        } else {
            c = Registry.chartConfig.colors.plotBackground
        }
        Ext.each(h,
        function(w) {
            var r = Trading.app.getController("Game");
            var k;
            var t;
            var o = [];
            var p;
            var q;
            var v;
            if (w.data.isOpen) {
                q = w.data.instrumentID;
                var s = r.isWeekendOptionEnabled(w);
                if (s) {
                    r.zoomLevels = r.weekendZoomLevels;
                    r.zoomLevelIndex = 1;
                    if (d[q].length > 10) {
                        for (p = d[q].length - 1; p > 0 && d[q][p][1] === d[q][p - 1][1]; p--) {}
                        d[q] = d[q].slice(0, p + 1);
                        for (p = d[q].length - 1; p > 0 && d[q][d[q].length - 1][0] - d[q][p][0] < 7200000; p--) {}
                        d[q] = d[q].slice(p)
                    }
                    v = d[q][d[q].length - 1][1];
                    w.data.last = v;
                    $("#game-" + q).attr("data-spot", v);
                    r.updateFormattedSpot(q);
                    var j = Ext.query(".spot-" + q);
                    for (p = 0; p < j.length; p++) {
                        Ext.fly(j[p]).dom.innerHTML = r.getFixedQuote(q, v)
                    }
                } else {
                    r.zoomLevels = r.regularZoomLevels
                }
                k = "chart-wrapper-" + w.data.instrumentID;
                for (p = 0; (d[w.data.instrumentID]) && (p < d[w.data.instrumentID].length); p++) {
                    if (! (p % 5) || !(d[w.data.instrumentID][p][0] % 60000)) {
                        o.push(d[w.data.instrumentID][p])
                    }
                }
                t = new Highcharts.StockChart({
                    xAxis: {
                        id: "chart-x-axis-" + w.data.instrumentID,
                        gridLineWidth: 1,
                        gridLineColor: Registry.chartConfig.colors.axisgrid,
                        lineColor: Registry.chartConfig.colors.axis,
                        tickLength: 0,
                        ordinal: false,
                        labels: {
                            formatter: function() {
                                f.setTime(this.value);
                                var y = "H:i";
                                var x = this.axis.series[0].data;
                                if (x.length && (x[x.length - 1].x - x[0].x < (5 * 60000))) {
                                    y = "H:i:s"
                                }
                                return Ext.Date.format(f, y)
                            },
                            style: a
                        }
                    },
                    yAxis: {
                        id: "chart-y-axis-" + w.data.instrumentID,
                        gridLineColor: Registry.chartConfig.colors.axisgrid,
                        labels: {
                            formatter: function() {
                                return r.getFixedQuote(q, this.value)
                            },
                            style: a
                        }
                    },
                    chart: {
                        renderTo: k,
                        plotBorderColor: Registry.chartConfig.colors.plotBorder,
                        plotBorderWidth: 1,
                        backgroundColor: "rgba(255,255,255,0)",
                        plotBackgroundColor: c
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
                        id: "chart-series-" + w.data.instrumentID,
                        name: "Price",
                        data: o,
                        type: b,
                        threshold: null,
                        fillColor: g
                    }],
                    plotOptions: {
                        line: {
                            lineWidth: 1,
                            color: Registry.chartConfig.colors.line,
                            dataGrouping: {
                                enabled: false
                            },
                            allowPointSelect: false,
                            marker: {
                                states: {
                                    hover: {
                                        radius: 2
                                    }
                                }
                            },
                            events: {
                                click: function(x) {
                                    Trading.app.getController("Game").selectClosestTradePoint(x.point)
                                }
                            }
                        },
                        areaspline: {
                            lineWidth: 1,
                            color: Registry.chartConfig.colors.line,
                            dataGrouping: {
                                enabled: false
                            },
                            allowPointSelect: false,
                            marker: {
                                states: {
                                    hover: {
                                        radius: 2
                                    }
                                }
                            },
                            events: {
                                click: function(x) {
                                    Trading.app.getController("Game").selectClosestTradePoint(x.point)
                                }
                            }
                        },
                        series: {
                            color: e,
                            states: {
                                hover: {
                                    lineWidth: 1,
                                    color: Registry.chartConfig.colors.line
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
                            var D = this.points[0].point;
                            var C = "<span>" + Ext.Date.format(new Date(D.x), "H:i:s") + "</span><br/><span>" + D.y + "</span>";
                            if (D.marker && D.marker.keep) {
                                var B = (D.tooltipData.direction == 1) ? Registry._["label-above"] : Registry._["label-below"];
                                C = '<span class="tooltip-label">' + Registry._["game-label-expiry"] + ":</span><span> " + Ext.Date.format(new Date(D.tooltipData.expiry), "H:i:s") + '</span><br/><span class="tooltip-label">' + B + " " + D.y + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-investment"] + ":</span><span> " + Trading.app.getController("Game").getUserCurrencyInfo().currencySymbol + D.tooltipData.stake + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-payout"] + ":</span><span> " + D.tooltipData.payout + '%</span><br/><span class="tooltip-label">' + Registry._["label-rebate"] + ":</span><span> " + D.tooltipData.rebate + "%</span>";
                                C += Ext.isEmpty(D.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-label">' + Registry._["label-return-amount"] + ":</span><span> " + Registry.baseCurrencySymbol + D.tooltipData.returnedAmount + "</span>";
                                if (D.tooltipData.social) {
                                    var F = D.tooltipData.social.userID;
                                    var x = Registry.socialImageUrlPattern.replace("[[[userID]]]", F) + "?v=" + Math.floor(new Date().getTime() / 10000);
                                    var z = D.tooltipData.social.nickname;
                                    var A = (D.tooltipData.direction == 1) ? "images/small-green-arrow-up-10x11.png": "images/small-red-arrow-down-10x11.png";
                                    var B = (D.tooltipData.direction == 1) ? Registry._["short-text-call"] : Registry._["short-text-put"];
                                    var y = Ext.isEmpty(D.tooltipData.returnedAmount) ? Registry._["short-text-opened"] : Registry._["short-text-closed"];
                                    var E = Ext.isEmpty(D.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-gain">' + Registry._["short-text-gain"] + ": " + Registry.baseCurrencySymbol + D.tooltipData.returnedAmount + "</span>";
                                    C = '<div id="tooltip-social-container"><div class="social-user-img-container"><img class="social-user-img" src="' + x + '" /><img class="social-user-arrow-img" src="' + A + '">&nbsp;</img></div><div class="advanced-social-trade-info"><span class="tooltip-nickname">' + z + ((Registry.env == "development") ? " (" + D.tooltipData.tradeID + ") ": "") + '</span><br/><span class="tooltip-status">' + y + " " + Registry._["short-text-a-binary"] + " " + B + " " + Registry._["short-text-option"] + "</span>" + E + "</div></div>"
                                }
                            }
                            return '<div class="tooltip-container">' + C + "</div>"
                        },
                        useHTML: true
                    }
                });
                if (s) {
                    var l = "chart-series-" + q;
                    var n = t.get(l);
                    var u = {
                        x: n.data[n.data.length - 1].x,
                        y: n.data[n.data.length - 1].y,
                        marker: {
                            enabled: true,
                            fillColor: Registry.chartConfig.colors.line,
                            lineColor: Registry.chartConfig.colors.guide,
                            lineWidth: 1,
                            keep: false
                        }
                    };
                    n.data[n.data.length - 1].update(u)
                }
                r.charts[q] = t;
                if (r.selectedGameTemplate === "financial") {
                    var m = o;
                    Ext.Ajax.request({
                        url: Registry.uriBase + "/ajax/instrument/history",
                        method: "GET",
                        params: {
                            instruments: Ext.encode([q]),
                            candlesticks: 1
                        },
                        success: function(x) {
                            x = Ext.decode(x.responseText);
                            r.candlestickCharts[q] = r.drawCandlestickChart(q, "chart-candlestick-wrapper-", x[q], m);
                            r.updateChartZoomRange(q);
                            if (r.selectedChartType === "line") {
                                r.showFinancialViewLineChart()
                            } else {
                                r.showFinancialViewCandleStickChart()
                            }
                            m = null
                        }
                    })
                } else {
                    r.updateChartRange(q)
                }
                r.markTrades(q, o);
                o = null;
                t = null
            }
        });
        h = null;
        d = null
    },
    moveChartIndicator: function(c) {
        if (! (Registry.chartConfig.indicator * 1) || !this.charts[c] || !$("#game-" + c).attr("data-spot")) {
            return
        }
        var f = this.charts[c];
        var g = "chart-series-" + c;
        var d = f.get(g);
        var e = d.data[d.data.length - 1].y;
        if (this.selectedGameTemplate === "financial" && this.selectedChartType === "candlestick" && this.candlestickCharts[c]) {
            f = this.candlestickCharts[c];
            g = "advanced-chart-candlestick-series-" + c
        }
        d = f.get(g);
        if (!d.data.length) {
            return
        }
        var b = (e - f.axes[1].min) / (f.axes[1].max - f.axes[1].min) * f.plotHeight;
        var a = f.plotTop + f.plotHeight - b;
        var h = $("#chart-indicator-" + c);
        if (this.selectedGameTemplate == "financial") {
            if (a < 40) {
                h.addClass("chart-indicator-bottom")
            } else {
                h.removeClass("chart-indicator-bottom")
            }
        }
        h.css("top", a + "px");
        h.html(this.getFixedQuote(c, $("#game-" + c).attr("data-spot")));
        h.css("display", "block")
    },
    stretchCharts: function(a) {
        var b = this.charts[a];
        var c = "chart-series-" + a;
        this.stretchChart(b, c);
        if (this.candlestickCharts[a]) {
            b = this.candlestickCharts[a];
            c = "advanced-chart-candlestick-series-" + a;
            this.stretchCandlestickChart(b, c)
        }
    },
    stretchChart: function(h, b) {
        var d = h.get(b);
        if (!d.data.length) {
            return
        }
        var c = d.data[0].y;
        var j = d.data[0].y;
        var g;
        var e;
        var a = d.data[d.data.length - 1].x;
        var f = a - this.zoomLevels[this.zoomLevelIndex] * 60000;
        for (e = d.data.length - 1; e > 0 && d.data[e].x >= f; e--) {
            g = d.data[e].y;
            if (g < c) {
                c = g
            }
            if (g > j) {
                j = g
            }
        }
        h.axes[1].setExtremes(c, j)
    },
    stretchCandlestickChart: function(f, h) {
        var d = f.get(h);
        if (!d.data.length) {
            return
        }
        var g = d.data[0].low;
        var e = d.data[0].high;
        var c;
        var b = d.data[d.data.length - 1].x;
        var a = b - this.zoomLevels[this.zoomLevelIndex] * 60000;
        for (c = d.data.length - 1; c > 0 && d.data[c].x >= a; c--) {
            if (d.data[c].low < g) {
                g = d.data[c].low
            }
            if (d.data[c].high > e) {
                e = d.data[c].high
            }
        }
        f.axes[1].setExtremes(g, e)
    },
    selectClosestTradePoint: function(a) {
        return;
        var f = a.series.chart;
        var h;
        var g;
        var e;
        var d = null;
        var b;
        var c = 90000;
        if (f.tradesMarkers) {
            for (g in f.tradesMarkers) {
                h = f.tradesMarkers[g];
                e = Math.abs(a.x - h.x);
                if ((d == null) || e < d) {
                    d = e;
                    b = h
                }
            }
            if (b && d < c) {
                if (!b.selected) {
                    f.tooltip.refresh([b])
                }
            } else {}
        }
    },
    startSocialObserver: function() {
        if (!Trading.app.getController("User").loggedIn) {
            return
        }
        var b = 30000;
        if (Registry.socialObserver) {
            Ext.TaskManager.stop(Registry.socialObserver)
        } else {
            Registry.socialObserver = {
                run: function() {
                    var g = Trading.app.getController("Game");
                    var f = g.getGames();
                    var e;
                    var c = [];
                    var d;
                    Ext.each(f,
                    function(h) {
                        if (h.data.isOpen) {
                            e = h.data.last;
                            if (e > 0 && (Registry.socialInstruments.indexOf(h.data.instrumentID) != -1)) {
                                c.push(h.data.instrumentID);
                                d = Ext.WindowMgr.get("advanced-chart-window-" + h.data.instrumentID);
                                if (d) {
                                    d.updateSocialEntryTimes()
                                }
                                g.updateSocialEntryTimes()
                            }
                        }
                    });
                    if (!Ext.isEmpty(c)) {
                        Ext.Ajax.request({
                            url: Registry.uriBase + "/ajax/instrument/social-positions",
                            method: "GET",
                            params: {
                                instrumentIDs: Ext.encode(c)
                            },
                            success: function(h) {
                                var n = Trading.app.getController("Game");
                                var j;
                                var l;
                                var k;
                                var m;
                                h = Ext.decode(h.responseText);
                                if ($.isEmptyObject(h)) {
                                    Registry.socialSite = false;
                                    Ext.TaskManager.stop(Registry.socialObserver);
                                    return
                                }
                                for (j in h) {
                                    m = h[j];
                                    l = n.charts[j];
                                    k = (l) ? l.get("chart-series-" + j) : null;
                                    if (k && k.data.length) {
                                        n.markSocialTrades(j, k.data, m)
                                    }
                                }
                                h = null;
                                n = null
                            }
                        })
                    }
                },
                interval: b
            }
        }
        var a = new Ext.util.DelayedTask(function() {
            Ext.TaskManager.start(Registry.socialObserver)
        });
        a.delay(b)
    },
    startChartUpdater: function() {
        var c;
        var b = 15000;
        if (Registry.chartUpdater) {
            Ext.TaskManager.stop(Registry.chartUpdater)
        } else {
            Registry.chartUpdater = {
                run: function() {
                    Trading.app.getController("Instrument").instruments.each(function(p) {
                        var k = Trading.app.getController("Game");
                        var l = k.isWeekendOptionEnabled(p);
                        if (l) {
                            return
                        }
                        var j;
                        var m;
                        var o;
                        j = p.data.instrumentID;
                        o = p.data.last;
                        m = k.charts[j];
                        if (o > 0) {
                            if (m) {
                                var f = "chart-series-" + j;
                                var h;
                                var n;
                                var e;
                                h = m.get(f);
                                if (h.data.length) {
                                    n = h.data[h.data.length - 1];
                                    if (n.marker && !n.marker.keep) {
                                        n.marker = {
                                            enabled: false
                                        };
                                        h.data[h.data.length - 1].update(n)
                                    }
                                    n = {
                                        x: k.time,
                                        y: o * 1,
                                        marker: {
                                            enabled: true,
                                            fillColor: Registry.chartConfig.colors.line,
                                            lineColor: Registry.chartConfig.colors.guide,
                                            lineWidth: 1,
                                            keep: false
                                        }
                                    };
                                    e = (!(Registry.chartConfig.leftToRight * 1 && k.getGameType(j) == 1) && (k.time - h.data[0].x) > 3600000);
                                    h.addPoint(n, true, e);
                                    k.colorBackground(j);
                                    var d = Ext.query(".game .spot-" + j);
                                    var g;
                                    for (g = 0; g < d.length; g++) {
                                        if (Ext.fly(d[g]).hasCls("highlight")) {
                                            Ext.fly(d[g]).highlight()
                                        }
                                    }
                                    k.moveChartIndicator(j);
                                    if (k.selectedGameTemplate === "financial") {
                                        k.updateChartZoomRange(j)
                                    }
                                }
                            }
                        }
                    })
                },
                interval: b
            }
        }
        var a = new Ext.util.DelayedTask(function() {
            Ext.TaskManager.start(Registry.chartUpdater)
        });
        a.delay(2000)
    },
    disableGame: function(a) {
        var b = "game-container-" + a;
        Ext.fly(b).addCls("disabled");
        Ext.fly(b).dom.setAttribute("data-disabled", "1");
        this.hideInvoice(a);
        this.hideConfirmation(a)
    },
    formatExpiry: function(d) {
        this.dateHelperExpiry.setTime(this.time);
        var c = this.dateHelperExpiry.getDate();
        var g = this.dateHelperExpiry.getMonth();
        this.dateHelperExpiry.setTime(d);
        var a = this.dateHelperExpiry.getDate();
        var f = this.dateHelperExpiry.getMonth();
        if ((a == c || a == c + 1) && (g == f)) {
            var b = (a == c) ? Registry._.today: Registry._.tomorrow;
            var e = Ext.Date.format(this.dateHelperExpiry, "H:i");
            return b + " " + e
        } else {
            switch (f) {
            case 0:
                g = Registry._.January;
                break;
            case 1:
                g = Registry._.February;
                break;
            case 2:
                g = Registry._.March;
                break;
            case 3:
                g = Registry._.April;
                break;
            case 4:
                g = Registry._.May;
                break;
            case 5:
                g = Registry._.June;
                break;
            case 6:
                g = Registry._.July;
                break;
            case 7:
                g = Registry._.August;
                break;
            case 8:
                g = Registry._.September;
                break;
            case 9:
                g = Registry._.October;
                break;
            case 10:
                g = Registry._.November;
                break;
            case 11:
                g = Registry._.December;
                break
            }
            return g + Ext.Date.format(this.dateHelperExpiry, " d, H:i")
        }
    },
    renderPagination: function() {
        var a = [];
        var b;
        if (this.numOfPages > 1) {
            for (b = 1; b <= this.numOfPages; b++) {
                a.push({
                    label: b,
                    page: b,
                    pressed: (b == this.page)
                })
            }
            if (this.page > 1) {
                Ext.Array.insert(a, 0, [{
                    label: "<",
                    page: (this.page - 1),
                    pressed: false
                }])
            }
            if (this.page < this.numOfPages) {
                a.push({
                    label: ">",
                    page: (this.page + 1),
                    pressed: false
                })
            }
        }
        this.tplPagination.overwrite("pagination-wrapper", a)
    },
    setTime: function(d, e, c) {
        this.time = d;
        if (Registry.customIndexView) {
            if (typeof(FX1) != "undefined") {
                FX1.setTime(d, e)
            }
            return
        }
        this.updateProgress();
        FinancialPanel.updateProgress();
        if (e || c) {
            this.renderGamesLite();
            FinancialPanel.updateExpirySelect();
            Trading.app.getController("User").updateDoubleUpButtonStatuses();
            var b = new Date(this.time);
            if (! ((Ext.Date.format(b, "i") * 1) % 7)) {
                var a = new Ext.util.DelayedTask(function() {
                    Trading.app.getController("Game").downloadSentiment()
                });
                a.delay(20000)
            }
        }
    },
    calcNumOfPages: function() {
        this.numOfPages = Math.floor((this.instruments.count() - 1) / this.pageSize) + 1;
        if (this.page > this.numOfPages) {
            this.page = this.numOfPages
        }
    },
    loadPage: function(b) {
        var a = this;
        scroll(0, 0);
        a.page = b;
        a.render()
    },
    filter: function(a, b) {
        this.currentFilter = a;
        if (this.instruments) {
            this.instruments.clearFilter()
        }
        if (a) {
            var c = (Ext.isArray(a)) ? a: [{
                property: a,
                value: true
            }];
            this.instruments.filter(c)
        }
        if (!b) {
            this.page = 1
        }
        this.render()
    },
    selectInstrumentByName: function(b) {
        $("#filter-search-input").val(b);
        var a = Trading.app.getController("Filter");
        a.search();
        $("html, body").animate({
            scrollTop: $("#game-filter").offset().top
        },
        "fast")
    },
    star: function(a) {
        var d = (Ext.Array.contains(Registry.starred, a)) ? "unstar": "star";
        var c = this.instruments.getById(a);
        if (!Trading.app.getController("User").forceLogin()) {
            return
        }
        if (d == "star") {
            Registry.starred.push(a);
            Ext.fly("instrument-name-" + a).addCls("starred")
        } else {
            Ext.Array.remove(Registry.starred, a);
            Ext.fly("instrument-name-" + a).removeCls("starred")
        }
        c.data.starred = (d == "star");
        if (d != "star") {
            if (this.currentFilter == "starred") {
                if (this.selectedGameTemplate == "financial" && !Registry.starred.length) {
                    var b = Trading.app.getController("Filter");
                    b.setFilter("featured")
                } else {
                    this.filter("starred", true)
                }
            }
        }
        User.star(a, (d == "unstar"))
    },
    direction: function(a, b) {
        if (Ext.getDom("game-" + a)) {
            Ext.getDom("game-" + a).setAttribute("data-direction", b)
        }
        this.setChartBackground(a, b);
        if ($("#confirmation-message-" + a).css("display") !== "none") {
            return
        }
        this.showInvoice(a)
    },
    setChartBackground: function(a, d, c) {
        var b = this.charts[a];
        if (c) {
            if (Ext.fly("invoice-" + a).dom.getAttribute("data-active") == "true") {
                return
            }
        }
        if (b) {
            this.charts[a].colorBackgroundDirection = d;
            this.colorBackground(a)
        }
    },
    colorBackground: function(e) {
        var j = this.charts[e].colorBackgroundDirection;
        if ((Ext.fly("chart-top-bg-" + e)) && (Ext.fly("chart-bottom-bg-" + e))) {
            if (j) {
                var g = this.charts[e];
                var c = "chart-series-" + e;
                var d = g.get(c);
                var k = d.data[d.data.length - 1].y;
                if (this.selectedGameTemplate === "financial" && this.selectedChartType === "candlestick" && this.candlestickCharts[e]) {
                    g = this.candlestickCharts[e];
                    c = "advanced-chart-candlestick-series-" + e
                }
                if (d.data[d.data.length - 1]) {
                    var b = (k - g.axes[1].min) / (g.axes[1].max - g.axes[1].min) * g.plotHeight;
                    var h = g.plotHeight - b;
                    var f = h - 5;
                    var a = g.plotTop - 15;
                    if (j == -1) {
                        Ext.fly("chart-top-bg-" + e).removeCls("active");
                        Ext.fly("chart-bottom-bg-" + e).addCls("active");
                        Ext.get("chart-bottom-bg-" + e).setStyle("height", b + "px");
                        Ext.get("chart-bottom-bg-" + e).setStyle("top", f + "px")
                    } else {
                        Ext.fly("chart-bottom-bg-" + e).removeCls("active");
                        Ext.fly("chart-top-bg-" + e).addCls("active");
                        Ext.get("chart-top-bg-" + e).setStyle("height", h + "px");
                        Ext.get("chart-top-bg-" + e).setStyle("top", a + "px")
                    }
                }
            } else {
                Ext.fly("chart-top-bg-" + e).removeCls("active");
                Ext.fly("chart-bottom-bg-" + e).removeCls("active")
            }
        }
    },
    expand: function(b, c) {
        c = (c) ? "-" + c: "";
        var e = "show-more" + c + "-" + b;
        var a = "more" + c + "-" + b;
        var d = {
            duration: 200,
            useDisplay: true,
            easing: "ease"
        };
        if (Ext.fly(e).hasCls("expanded")) {
            Ext.fly(e).removeCls("expanded");
            Ext.get(a).slideOut("t", d)
        } else {
            Ext.each(Ext.query("#show-more-container-" + b + " .show-more.expanded"),
            function(f) {
                Ext.fly(f.id).removeCls("expanded");
                Ext.get(f.id.replace("show-", "")).slideOut("t", d)
            });
            Ext.fly(e).addCls("expanded");
            Ext.get(a).slideIn("t", d)
        }
    },
    updateSocialEntryTimes: function() {
        var a = this;
        Ext.each(Ext.query(".activity-entry .entry-time"),
        function(b) {
            var c = b.getAttribute("data-timestamp") * 1;
            Ext.fly(b.id).update(a.tplActivityEntry.formatTime(c))
        })
    },
    updateSocialActivityViewer: function(c, k) {
        var d = this;
        var j;
        var a;
        var e;
        var f;
        var g = 3;
        var h = 4;
        var b = 1500;
        if (!Registry.socialActivityDelays) {
            Registry.socialActivityDelays = {}
        }
        if (!Registry.socialActivityDelays[c]) {
            Registry.socialActivityDelays[c] = 0
        }
        for (e in k) {
            j = k[e];
            for (f in j) {
                a = j[f];
                a.instrumentID = c;
                a.eventType = e;
                a.eventID = Ext.id();
                new Ext.util.DelayedTask(function(l) {
                    var n = l.event;
                    d.addActivityEntry(n);
                    Registry.socialActivityDelays[n.instrumentID] -= b;
                    var m = Ext.getDom("activity-panel-" + n.instrumentID);
                    if (m) {
                        if (m.childNodes.length > h) {
                            Ext.get(m).last().remove()
                        }
                        if (m.childNodes.length > g) {
                            Ext.fly(m).addCls("scroll")
                        } else {
                            Ext.fly(m).removeCls("scroll")
                        }
                    }
                },
                null, [{
                    event: Ext.clone(a)
                }]).delay(Registry.socialActivityDelays[c]);
                Registry.socialActivityDelays[c] += b
            }
        }
    },
    addActivityEntry: function(c) {
        var a = Ext.fly("activity-panel-" + c.instrumentID);
        if (a) {
            var b;
            switch (this.selectedGameTemplate) {
            case "regular":
                b = this.tplActivityEntry;
                break;
            case "small":
                b = this.tplSmallActivityEntry;
                break
            }
            if (a.hasCls("empty")) {
                b.overwrite("activity-panel-" + c.instrumentID, c);
                a.removeCls("empty")
            } else {
                b.insertFirst("activity-panel-" + c.instrumentID, c)
            }
        }
    },
    selectPayout: function(d, b, a) {
        var h = b.split("-");
        var f = Ext.getDom("game-" + d);
        var c = Ext.get("payout-" + d);
        if (f) {
            f.setAttribute("data-payout", h[0]);
            f.setAttribute("data-rebate", h[1])
        }
        var e = this.formatPayout(h[0]);
        if (c) {
            c.dom.innerHTML = e;
            if (!a) {
                c.show({
                    duration: 1000,
                    useDisplay: true,
                    easing: "ease"
                })
            }
        }
        var g = Ext.fly("invoice-" + d);
        if (g && g.dom.getAttribute("data-active") == "true") {
            this.showInvoice(d)
        }
    },
    formatPayout: function(b) {
        var a;
        b = parseInt(b);
        switch (Registry.payoutDisplay) {
        case 1:
            a = this.getUserCurrencyInfo().currencySymbol + new Number(1 + b / 100).toFixed(2);
            break;
        case 2:
            a = b + "%";
            break;
        case 3:
            a = (100 + b) + "%";
            break
        }
        return a
    },
    showInvoice: function(j) {
        if (this.locked[j]) {
            return
        }
        if (Ext.fly("game-container-" + j).dom.getAttribute("data-disabled")) {
            this.showError(j, "Instrument is currently not tradable", true);
            return
        }
        var d = this.selectedExpiries[j];
        var f = Ext.get("invoice-" + j);
        var o = Ext.getDom("game-" + j);
        if (!o) {
            return
        }
        var e = {
            duration: 1000,
            useDisplay: true,
            easing: "ease"
        };
        var h = {
            direction: o.getAttribute("data-direction"),
            payout: o.getAttribute("data-payout"),
            formattedPayout: this.formatPayout(o.getAttribute("data-payout")),
            rebate: o.getAttribute("data-rebate"),
            expiry: d,
            instrumentID: j,
            last: this.getFixedQuote(j, this.instruments.getById(j).data.last)
        };
        this.hideConfirmation(j);
        Ext.fly("payout-wrapper-" + j).addCls("x-hidden");
        Ext.fly("game-" + j).dom.setAttribute("data-expiry", d);
        var n = Ext.fly("investment-amount-" + j);
        var c;
        if (n) {
            c = n.dom.value
        }
        f.dom.innerHTML = this.tplInvoice.apply(h);
        if (Ext.getDom("game-" + j).getAttribute("enabled") == "true") {
            $("#apply-" + j).removeClass("disabled")
        } else {
            $("#apply-" + j).addClass("disabled")
        }
        $("#investment-amount-" + j).combobox([]);
        var a = [];
        var m;
        var b = Registry.investmentLimits.minStake * 1;
        var p = Registry.investmentLimits.maxStake * 1;
        if (this.getGameType(j) == "2") {
            b = Registry.investmentLimits.minStake60sec * 1;
            p = Registry.investmentLimits.maxStake60sec * 1
        } else {
            if (this.getGameType(j) == "7") {
                b = Registry.investmentLimits.minStakeWeekend * 1;
                p = Registry.investmentLimits.maxStakeWeekend * 1
            } else {
                if (this.getGameType(j) == "11") {
                    b = Registry.investmentLimits.minStakeLongTerm * 1;
                    p = Registry.investmentLimits.maxStakeLongTerm * 1
                }
            }
        }
        this.instrumentInvestmentLimits[j] = {
            minStake: b,
            maxStake: p
        };
        var g;
        var l;
        for (g = 0; g < Registry.investmentOptions.length; g++) {
            m = Registry.investmentOptions[g] * 1;
            l = m * this.getUserCurrencyInfo().conversionRate;
            if (l >= b && l <= p) {
                a.push(m + "")
            }
        }
        $.combobox.instances["investment-amount-" + j].setSelectOptions(a);
        var k;
        if (n && c >= b && c <= p) {
            k = c
        } else {
            if (this.getGameType(j) === "2") {
                k = Registry.investmentDefaults.sixtySeconds
            } else {
                k = Registry.investmentDefaults.highLow
            }
        }
        if (k * this.getUserCurrencyInfo().conversionRate < b) {
            k = a[0]
        }
        Ext.fly("investment-amount-" + j).dom.value = k;
        this.setReturnAmount(j, parseInt(o.getAttribute("data-payout")), parseInt(o.getAttribute("data-rebate")));
        f.dom.setAttribute("data-active", "true");
        f.setVisibilityMode(Ext.Element.DISPLAY);
        f.show(e);
        Ext.fly("invoice-" + j).removeCls("x-hidden")
    },
    hideInvoice: function(a, b) {
        var c = Ext.get("invoice-" + a);
        this.setChartBackground(a, false);
        if (c) {
            c.dom.setAttribute("data-active", "false");
            c.setVisibilityMode(Ext.Element.DISPLAY);
            c.hide();
            Ext.fly("invoice-" + a).addCls("x-hidden")
        }
        if (b) {
            Ext.fly("payout-wrapper-" + a).addCls("x-hidden")
        } else {
            Ext.fly("payout-wrapper-" + a).removeCls("x-hidden")
        }
    },
    trade: function(instrumentID, params, isDoubleUp, tradeID) {
        if (Ext.getDom("game-" + instrumentID).getAttribute("enabled") == "false") {
            return
        }
        var game;
        if (!Trading.app.getController("User").forceLogin()) {
            return
        }
        if (this.locked[instrumentID]) {
            return
        }
        if (Registry.questionaryRequired == 1) {
            this.showError(instrumentID, Registry._["questionary-required"] + '<a class="questionary-button"' + Registry.questionnaireTargetUrl + 'href="' + Registry.questionnaireUrl + '">' + Registry._["questionary-required-button"] + "</a>", false);
            return
        }
        this.locked[instrumentID] = true;
        if (!isDoubleUp) {
            Ext.fly("loader-" + instrumentID).addCls("loading");
            Ext.fly("invoice-spot-" + instrumentID).removeCls("spot-" + instrumentID);
            Ext.fly("invoice-spot-" + instrumentID).removeCls("trend-up");
            Ext.fly("invoice-spot-" + instrumentID).removeCls("trend-down")
        } else {
            $("#trade-entry-info-loading-" + tradeID).addClass("loading").removeClass("x-hidden")
        }
        if (!params) {
            game = Ext.get("game-" + instrumentID).dom;
            params = {};
            params.instrumentID = instrumentID;
            params.payout = game.getAttribute("data-payout") * 1;
            params.rebate = game.getAttribute("data-rebate") * 1;
            params.direction = game.getAttribute("data-direction") * 1;
            params.expiry = game.getAttribute("data-expiry") * 1;
            params.stake = Math.round(Ext.fly("investment-amount-" + instrumentID).getValue() * this.getUserCurrencyInfo().conversionRate);
            params.userCurrency = Registry.userCurrency;
            params.userCurrencyStake = Ext.fly("investment-amount-" + instrumentID).getValue();
            params.strike = Ext.fly("invoice-spot-" + instrumentID).dom.innerHTML;
            params.gameType = this.getGameType(instrumentID);
            params.practice = this.practiceMode
        }
        if (typeof params.source === "undefined") {
            params.source = "Simplified Platform"
        }
        if (!this.verifyTrade(params, isDoubleUp)) {
            return
        }
        Ext.Ajax.request({
            url: Registry.uriBase + "/ajax/user/trade",
            scope: this,
            params: params,
            success: function(response, options) {
                delete this.locked[instrumentID];
                response = Ext.decode(response.responseText);
                var params = options.params;
                if (isDoubleUp) {
                    $("#trade-entry-info-loading-" + tradeID).addClass("x-hidden").removeClass("loading")
                }
                if (response.success) {
                    tradeID = tradeID ? tradeID: response.tradeID;
                    this.showConfirmation(instrumentID, isDoubleUp, tradeID, response.allowTimedCancel);
                    var trade = Ext.create("Trading.model.Trade", {
                        tradeID: response.tradeID,
                        type: params.gameType,
                        instrumentID: params.instrumentID,
                        timestamp: response.timestamp,
                        expiry: params.expiry,
                        stake: params.stake,
                        userCurrency: params.userCurrency,
                        userCurrencyStake: params.userCurrencyStake,
                        strike: params.strike,
                        direction: params.direction,
                        payout: params.payout,
                        rebate: params.rebate,
                        status: 1,
                        allowClosePosition: response.allowClosePosition
                    });
                    Trading.app.getController("User").trade(trade);
                    var instrumentController = Trading.app.getController("Instrument");
                    var instrument = instrumentController.instruments.getById(instrumentID);
                    var isWeekendOptionActive = this.isWeekendOptionEnabled(instrument);
                    if (!isWeekendOptionActive) {
                        this.addTradeMarker(instrumentID, response.tradeID)
                    }
                } else {
                    if (response.details) {
                        this.processTradeErrorDetails(response.details)
                    }
                    this.showError(params.instrumentID, response.message, false, isDoubleUp, tradeID)
                }
            },
            failure: function(response) {
                delete this.locked[instrumentID];
                if (isDoubleUp) {
                    $("#trade-entry-info-loading-" + tradeID).addClass("x-hidden").removeClass("loading")
                }
                this.showError(instrumentID, Registry._["trading-error-network"], false, isDoubleUp, tradeID);
                eval(response.responseText)
            }
        })
    },
    processTradeErrorDetails: function(a) {
        if (a.frozen && Registry.frozenUrl.length) {
            var c = "frozen-window";
            var b = Ext.WindowMgr.get(c);
            if (!b) {
                b = new Ext.Window({
                    id: c,
                    title: Registry._["account-frozen-title"],
                    width: 655,
                    height: 600,
                    layout: "fit",
                    resizable: true,
                    items: [{
                        xtype: "component",
                        autoEl: {
                            tag: "iframe",
                            src: Registry.frozenUrl
                        }
                    }]
                })
            }
            b.show()
        }
    },
    verifyTrade: function(d, e) {
        var c = false;
        if (! (d.strike * 1)) {
            c = true;
            this.showError(d.instrumentID, Registry._["invalid-strike"])
        }
        d.stake *= 1;
        if (!e) {
            var a = this.instrumentInvestmentLimits[d.instrumentID].minStake;
            var b = this.instrumentInvestmentLimits[d.instrumentID].maxStake;
            if (d.stake < a) {
                c = true;
                this.showError(d.instrumentID, Registry._["min-trade"] + ": " + this.getUserCurrencyInfo().currencySymbol + Ext.util.Format.number(a / this.getUserCurrencyInfo().conversionRate, "0,000.00"))
            }
            if (d.stake > b) {
                c = true;
                this.showError(d.instrumentID, Registry._["max-trade"] + ": " + this.getUserCurrencyInfo().currencySymbol + Ext.util.Format.number(b / this.getUserCurrencyInfo().conversionRate, "0,000.00"))
            }
        }
        if (d.stake > Registry.wallet.credit) {
            c = true;
            this.showError(d.instrumentID, Registry._["deposit-required"])
        }
        return ! c
    },
    showConfirmation: function(a, f, h, g) {
        var j;
        if (f) {
            j = Ext.get("trade-entry-confirmation-message-" + h)
        } else {
            j = Ext.get("confirmation-message-" + a)
        }
        var b = '<div class="message-icon"></div><div class="message-title">' + Registry._["trading-message-trade-accepted"] + "</div>";
        if (!f) {
            this.hideInvoice(a, true)
        }
        var c = this;
        if (g && !f) {
            b += '<div class="message-body"><a id="cancel-trade-button' + h + '" class="button cancel-trade-button" href="#" onclick="Trading.app.getController(\'Game\').cancelTrade(\'' + a + "'," + h + '); return false;">' + Registry._.Cancel + ' <span id="cancel-timer-' + h + '">' + Registry.cancelTradePeriod + '</span></a><span class="loadable" id="cancel-loader-' + h + '">&nbsp;</span><div class="message-container evaluation-message" style="display: none;" id="response-message-' + h + '"></div></div>';
            var d = new Utils.countdown({
                seconds: parseInt(Registry.cancelTradePeriod),
                onUpdateStatus: function(l) {
                    var k = Ext.get("cancel-timer-" + h);
                    if (!k) {
                        d.stop()
                    } else {
                        Utils.cancelTradeCountdownProgress(k, l)
                    }
                },
                onCounterEnd: function() {
                    var k = Ext.get("cancel-timer-" + h);
                    var l = Ext.get("cancel-trade-button" + h);
                    if (l && k) {
                        l.addCls("disabled");
                        l.set({
                            onClick: "return false"
                        });
                        c.hideConfirmation(a, true, false, f, h, true)
                    }
                }
            });
            d.start()
        } else {
            this.hideConfirmation(a, true, false, f, h);
            var e = function() {
                j.un("click", e);
                c.hideConfirmation(a, false, true, f, h)
            };
            j.on("click", e)
        }
        j.setVisibilityMode(Ext.Element.DISPLAY);
        j.dom.innerHTML = b;
        j.addCls(g && !f ? "confirmation-and-cancel": "");
        j.show()
    },
    hideConfirmation: function(e, b, a, g, j, h) {
        var k;
        if (g) {
            k = Ext.get("trade-entry-confirmation-message-" + j)
        } else {
            k = Ext.get("confirmation-message-" + e)
        }
        var d = {
            duration: 1000,
            useDisplay: true,
            easing: "ease",
            listeners: {
                scope: this,
                afteranimate: function() {
                    delete this.locked[e];
                    var l = Ext.fly("invoice-" + e);
                    if (!g && l.dom.getAttribute("data-active") !== "true") {
                        Ext.fly("payout-wrapper-" + e).removeCls("x-hidden")
                    }
                }
            }
        };
        k.removeCls("trade-error");
        k.setVisibilityMode(Ext.Element.DISPLAY);
        var f = this;
        if (b) {
            var c = new Ext.util.DelayedTask(function() {
                if (g) {
                    delete f.tradeHideConfirmationTasks[j]
                } else {
                    delete f.instrumentHideConfirmationTasks[e]
                }
                k.hide(d)
            });
            if (!h) {
                c.delay(2500)
            } else {
                c.delay(0)
            }
            if (g) {
                this.tradeHideConfirmationTasks[j] = c
            } else {
                this.instrumentHideConfirmationTasks[e] = c
            }
        } else {
            k.hide();
            if (g) {
                if (this.tradeHideConfirmationTasks[j]) {
                    this.tradeHideConfirmationTasks[j].cancel();
                    delete this.tradeHideConfirmationTasks[j]
                }
            } else {
                if (this.instrumentHideConfirmationTasks[e]) {
                    this.instrumentHideConfirmationTasks[e].cancel();
                    delete this.instrumentHideConfirmationTasks[e]
                }
            }
            if (a && !g) {
                Ext.fly("payout-wrapper-" + e).removeCls("x-hidden")
            }
        }
    },
    cancelTrade: function(c, d, b) {
        Ext.get("cancel-timer-" + d).remove();
        Ext.get("cancel-trade-button" + d).addCls("disabled");
        Ext.get("cancel-trade-button" + d).set({
            onClick: "return false"
        });
        Ext.get("cancel-loader-" + d).addCls("loading");
        var a = this;
        Ext.Ajax.request({
            url: Registry.uriBase + "/ajax/user/cancel-trade-timed",
            scope: this,
            params: {
                id: d
            },
            success: function(f, g) {
                f = Ext.decode(f.responseText);
                if (f.success) {
                    if (b) {
                        $("#fp-confirmation-message .message-title").html(Registry._["cancelled-successfully"]);
                        $("#fp-confirmation-message .message-body").hide();
                        setTimeout(function() {
                            $("#fp-confirmation-message").fadeOut(500,
                            function() {
                                $("#fp-confirmation-message .message-title").removeClass("centered")
                            })
                        },
                        3000)
                    } else {
                        var j = Ext.get("confirmation-message-" + c);
                        var h = '<div class="message-icon"></div><div class="message-title">' + Registry._["cancelled-successfully"] + "</div>";
                        j.dom.innerHTML = h;
                        var k = function() {
                            j.un("click", k);
                            e.cancel();
                            a.hideConfirmation(c, false, true, null, d)
                        };
                        j.on("click", k);
                        a.hideConfirmation(c, true, false, null, d);
                        var e = new Ext.util.DelayedTask(function() {
                            j.un("click", k)
                        });
                        e.delay(2500)
                    }
                    new Ext.util.DelayedTask(Trading.app.getController("User").onPerformOperationSuccess, null, [{
                        tradeID: d,
                        status: "at",
                        timestamp: null,
                        estimatedReturn: null,
                        isCanceled: true
                    }]).delay(500);
                    Ext.fly("trade-" + d + "-close-position").hide();
                    Ext.fly("trade-" + d + "-double-up").hide();
                    Ext.fly("trade-" + d + "-hedge").hide();
                    if (Ext.fly("fp-trade-entry-indicator-" + d)) {
                        setTimeout(function() {
                            Ext.fly("fp-trade-entry-indicator-" + d).removeCls("trade-entry-indicator");
                            Ext.fly("fp-trade-entry-indicator-" + d).dom.innerHTML = "<span>Canceled</span>";
                            Ext.fly("fp-trade-entry-indicator-" + d).show()
                        },
                        500)
                    }
                } else {
                    if (b) {
                        $("#fp-confirmation-message .message-title").html(f.message.body);
                        $("#fp-confirmation-message .message-icon").hide();
                        $("#fp-confirmation-message .message-body").hide();
                        setTimeout(function() {
                            $("#fp-confirmation-message").fadeOut(500,
                            function() {
                                $("#fp-confirmation-message .message-title").removeClass("centered")
                            })
                        },
                        3000)
                    } else {
                        this.showError(c, f.message.body, false, false, d)
                    }
                }
            },
            failure: function() {}
        })
    },
    showError: function(e, b, a, h, f) {
        var c = this;
        if (h) {
            message = Ext.get("trade-entry-confirmation-message-" + f)
        } else {
            message = Ext.get("confirmation-message-" + e)
        }
        if (!h) {
            this.hideInvoice(e, true)
        }
        message.setVisibilityMode(Ext.Element.DISPLAY);
        message.dom.innerHTML = '<div class="error-message">' + b + "</div>";
        message.addCls("trade-error");
        message.show();
        var d = new Ext.util.DelayedTask(function() {
            delete c.locked[e];
            message.un("click", g);
            if (a || h) {
                c.hideConfirmation(e, true, true, h, f)
            } else {
                c.showInvoice(e)
            }
        });
        d.delay(5000);
        var g = function() {
            message.un("click", g);
            d.delay(0)
        };
        message.on("click", g)
    },
    quote: function(v, e, c, p, h, t) {
        var m = Trading.app.getController("Instrument");
        var u = m.instruments.getById(v);
        var b = this.isWeekendOptionEnabled(u);
        if (b) {
            return
        }
        e = e * 1;
        u.data.last = e;
        var l = "";
        var s = Registry.chartConfig.colors.line;
        var r = "chart-series-" + v;
        var f;
        var g = -1;
        if (p == 1) {
            l = "trend-up";
            s = Registry.chartConfig.colors.up
        } else {
            if (p == -1) {
                l = "trend-down";
                s = Registry.chartConfig.colors.down
            }
        }
        $("#game-" + v).attr("data-spot", e);
        this.updateFormattedSpot(v);
        $(".spot-trend-" + v).removeClass("trend-up trend-down").addClass(l);
        var j = Ext.query(".spot-" + v);
        var q;
        for (q = 0; q < j.length; q++) {
            Ext.fly(j[q]).dom.innerHTML = this.getFixedQuote(v, e);
            if (l) {
                Ext.fly(j[q]).removeCls(["trend-up", "trend-down"]);
                Ext.fly(j[q]).addCls(l)
            }
            if (Ext.fly(j[q]).hasCls("highlight")) {
                Ext.fly(j[q]).highlight()
            }
        }
        var k = this.charts[v];
        if (!k) {
            return
        }
        f = k.get(r);
        if (f.data.length && f.data[f.data.length - 1].marker.keep) {
            g = f.data[f.data.length - 1].tooltipData.tradeID
        }
        var a = Ext.WindowMgr.get("advanced-chart-window-" + v);
        if (a) {
            a.quote(c, e, p, g)
        }
        if (this.selectedGameTemplate == "financial") {
            var n = this.candlestickCharts[v];
            this.addPointToCandlestickChart(v, n, c, e);
            this.updateChartZoomRange(v)
        }
        this.stretchCharts(v);
        this.moveChartIndicator(v);
        if (this.lastQuotes[v] && (c - this.lastQuotes[v] < Registry.chartUpdateFrequency)) {
            var d = $("#chart-indicator-" + v);
            d.html(this.getFixedQuote(v, e));
            return
        }
        this.lastQuotes[v] = c;
        if (k) {
            var o = {
                x: c,
                y: e,
                marker: {
                    enabled: true,
                    fillColor: s,
                    lineColor: Registry.chartConfig.colors.guide,
                    lineWidth: 1,
                    keep: false
                }
            };
            if (f.data.length) {
                if (!f.data[f.data.length - 1].marker.keep) {
                    f.data[f.data.length - 1].update(o)
                } else {
                    if (c > f.data[f.data.length - 1].x) {
                        f.addPoint(o)
                    }
                }
            } else {
                f.addPoint(o)
            }
            this.colorBackground(v);
            k.get("chart-y-axis-" + v).removePlotLine("chart-guide-" + v);
            k.get("chart-y-axis-" + v).addPlotLine({
                id: "chart-guide-" + v,
                value: e,
                color: Registry.chartConfig.colors.guide,
                width: 1,
                dashStyle: "longdash"
            })
        }
        this.stretchCharts(v);
        this.moveChartIndicator(v);
        if (this.showGameInfo) {
            h = h ? this.getFixedQuote(v, h) : "-";
            t = t ? this.getFixedQuote(v, t) : "-";
            $("#ask-" + v).html(h);
            $("#fp-ask-" + v).html(h);
            $("#bid-" + v).html(t);
            $("#fp-bid-" + v).html(t)
        }
    },
    refreshPayouts: function() {
        var k = this;
        var c = this.getGames();
        var h;
        var f;
        var e;
        var a;
        var l;
        var m;
        var g;
        var j;
        var b;
        var o;
        var n;
        var d;
        Ext.each(c,
        function(p) {
            if (p.data.isOpen) {
                o = k.getGameType(p.data.instrumentID);
                n = o;
                if (n * 1 == 7) {
                    return
                }
                a = false;
                e = Ext.get("payouts-" + p.data.instrumentID).getValue().split("-");
                if (e.length == 2) {
                    p.payouts().each(function(r) {
                        if (r.data.gameType == n) {
                            d = r
                        }
                    });
                    l = d.payoutRanges().findBy(function(r) {
                        return ((r.data.payout == e[0]) && (r.data.rebate == e[1]))
                    });
                    if (l > -1) {
                        a = true
                    }
                }
                h = [];
                m = "";
                p.payouts().each(function(r) {
                    if (r.data.gameType == n) {
                        r.payoutRanges().each(function(s) {
                            f = false;
                            if (a) {
                                f = ((s.data.payout == e[0]) && (s.data.rebate == e[1]))
                            } else {
                                f = (s.data.payout == p.data.payout)
                            }
                            h.push({
                                payout: s.data.payout,
                                rebate: s.data.rebate,
                                selected: f
                            });
                            if (f) {
                                m = s.data.payout + "-" + s.data.rebate
                            }
                        })
                    }
                });
                if (m == "") {
                    if (h.length) {
                        j = h[0];
                        j.selected = true;
                        m = j.payout + "-" + j.rebate
                    }
                }
                var q = Ext.get("payouts-" + p.data.instrumentID).dom;
                q.options.length = 0;
                for (g = 0; g < h.length; g++) {
                    j = h[g];
                    b = new Option(j.payout + "% / " + j.rebate + "%", j.payout + "-" + j.rebate, j.selected);
                    b.setAttribute("hidden", "");
                    q.options[g] = b;
                    if (j.selected) {
                        q.selectedIndex = g
                    }
                }
                if (m) {
                    k.selectPayout(p.data.instrumentID, m)
                }
            }
        })
    },
    downloadSentiment: function() {
        var f = 1;
        var a = this;
        var d = this.time - (this.time % 60000);
        var b = new Date(d);
        var c = Ext.Date.format(b, "i") * 1;
        var e = (c % f);
        d = d - (e * 60000);
        Ext.data.JsonP.request({
            url: Registry.cdn + "/sentiment/" + (d / 1000) + ".json",
            callbackName: "sentiment",
            scope: this,
            success: function(g) {
                if (g) {
                    a.sentiment = g;
                    a.renderSentiment()
                }
            }
        })
    },
    renderSentiment: function() {
        if (!this.sentiment) {
            this.downloadSentiment();
            return
        }
        var b = this;
        var c;
        var f = this.getGames();
        var a;
        var e;
        var d;
        if (this.selectedGameTemplate == "financial") {
            d = this.tplFinancialViewSentiment
        } else {
            d = this.tplSentiment
        }
        Ext.each(f,
        function(g) {
            c = g.data.instrumentID;
            if (Ext.fly("game-extended-info-" + c)) {
                a = 50;
                e = 50;
                if (b.sentiment[c]) {
                    a = b.sentiment[c]["call"];
                    e = b.sentiment[c]["put"]
                }
                d.overwrite("game-extended-info-" + c, {
                    instrumentID: c,
                    above: a,
                    below: e
                })
            }
        })
    },
    hasAdvancedGamesEnabled: function(a) {
        var b = (Registry.advancedGamesConfig.game_above_below.indexOf(a) != -1 || Registry.advancedGamesConfig.game_range.indexOf(a) != -1 || Registry.advancedGamesConfig.game_touch.indexOf(a) != -1 || Registry.advancedGamesConfig.game_no_touch.indexOf(a) != -1);
        return (b && Registry.financialPanelEnabled)
    },
    hasAdvancedGames: function(a) {
        var f = this.hasAdvancedGamesEnabled(a);
        var d = Trading.app.getController("Instrument");
        var c = d.instruments.getById(a);
        var e = d.time;
        var b = false;
        c.tradingHours().each(function(g) {
            if (g.data.gameType < 3 || g.data.gameType > 6) {
                return
            }
            if (FinancialPanel.isOpenInConfig(g.data.gameType, a)) {
                g.tradingHourRanges().each(function(h) {
                    if (e > h.data.from && e <= h.data.to) {
                        b = true
                    }
                })
            }
        });
        return (f && b)
    },
    renderGameTypesMenu: function(e) {
        var b = this;
        var c = Trading.app.getController("Instrument").instruments.getById(e);
        var a = Trading.app.getController("Game").isWeekendOptionEnabled(c);
        var d;
        if (a) {
            d = {
                instrumentID: e,
                defaultGameType: 7,
                gameTypes: [{
                    name: Registry._["game-type-name-weekend-option"],
                    type: 7,
                    enabled: true
                }]
            }
        } else {
            d = {
                instrumentID: e,
                defaultGameType: b.getDefaultGameType(e),
                gameTypes: [{
                    name: Registry._["game-type-name-high-low"],
                    type: 1,
                    enabled: true
                }]
            };
            if (Registry.shortGames.indexOf(e) != -1) {
                d.gameTypes.push({
                    name: Registry._["game-type-name-60-sec"],
                    type: 2,
                    enabled: true
                })
            }
            if (b.hasAdvancedGamesEnabled(e)) {
                d.gameTypes.push({
                    name: Registry._["financial-panel-name"],
                    type: 3,
                    enabled: true
                })
            }
        }
        if (b.selectedGameTemplate == "regular") {
            return b.tplGameTypesMenu.apply(d)
        } else {
            if (b.selectedGameTemplate == "small") {
                return b.tplSmallGameTypesMenu.apply(d)
            } else {
                return b.tplGameTypesMenu.apply(d)
            }
        }
    },
    renderInstrumentInfo: function(a) {
        return this.tplInstrumentInfo.apply(a)
    },
    renderAskBidInfo: function(a) {
        return this.tplAskBidInfo.apply(a)
    },
    initTemplates: function() {
        var a = this;
        this.tplSentiment = new Ext.XTemplate('<div class="sentiment-header">' + Registry._["sentiment-traders-choice"] + "</div>", '<div class="cf">', '<span class="sentiment-label-above">' + Registry._["label-above"] + "</span>", '<div class="sentiment-bar cf">', '<div class="sentiment-bar-above" id="sentiment-bar-above-{instrumentID}" style="width: {above}%; overflow: hidden;">{above}%</div>', '<div class="sentiment-bar-below" id="sentiment-bar-below-{instrumentID}" style="width: {below}%; overflow: hidden;">{below}%</div>', "</div>", '<span class="sentiment-label-below">' + Registry._["label-below"] + "</span>", "</div>");
        this.tplFinancialViewSentiment = new Ext.XTemplate('<div class="sentiment-header">' + Registry._["sentiment-traders-choice"] + "</div>", '<div class="big-game-sentiment-container cf">', '<div class="sentiment-bar cf">', '<div class="sentiment-bar-above" id="sentiment-bar-above-{instrumentID}" style="width: {above}%; overflow: hidden;">{above}%</div>', '<div class="sentiment-bar-below" id="sentiment-bar-below-{instrumentID}" style="width: {below}%; overflow: hidden;">{below}%</div>', "</div>", "<br>", '<span class="sentiment-label-above">' + Registry._["label-above"] + "</span>", '<span class="sentiment-label-below">' + Registry._["label-below"] + "</span>", "</div>");
        this.tplPayouts = new Ext.XTemplate('<tpl for=".">', '<option value="{payout}-{rebate}" {[(values.selected) ? "selected=selected" : ""]}>{payout}% / {rebate}%</option>', "</tpl>");
        this.tplMore = new Ext.XTemplate('<table class="more-options">', "<tr>", "<td>" + Registry._.riskometer + ":</td>", '<td><select id="payouts-{instrumentID}" class="change-payout-box" onchange="Trading.app.getController(\'Game\').selectPayout(\'{instrumentID}\', this.value)">{[this.renderPayouts(values)]}</select></td>', '<td><div class="risk-o-meter-help" onclick="Trading.app.getController(\'User\').showRiskOMeterHelp(); return false;">&nbsp;</div></td>', "</tr>", "</table>", '<div class="game-extended-info" id="game-extended-info-{instrumentID}"></div>', {
            renderPayouts: function(c) {
                var d = [];
                var b = a.getDefaultGameType(c.instrumentID);
                a.instruments.getById(c.instrumentID).payouts().each(function(e) {
                    if (b == e.data.gameType) {
                        e.payoutRanges().each(function(f) {
                            d.push({
                                payout: f.data.payout,
                                rebate: f.data.rebate,
                                selected: (f.data.payout == e.data.payout)
                            })
                        })
                    }
                });
                return a.tplPayouts.apply(d)
            }
        });
        this.tplActivityEntryFunctions = {
            setPublicImage: function(b) {
                return Registry.socialImageUrlPattern.replace("[[[userID]]]", b) + "?v=" + Math.floor(new Date().getTime() / 10000)
            },
            formatTime: function(f) {
                var e = new Date();
                var d = new Date(f);
                var g = 60 * 1000;
                var j = g * 60;
                var h = j * 24;
                var c = h * 30;
                var b = h * 365;
                var l = e - d;
                var k;
                if (l < g) {
                    k = Math.round(l / 1000);
                    return (k > 1) ? k + " seconds ago": k + " second ago"
                } else {
                    if (l < j) {
                        k = Math.round(l / g);
                        return (k > 1) ? k + " minutes ago": k + " minute ago"
                    } else {
                        if (l < h) {
                            k = Math.round(l / j);
                            return (k > 1) ? k + " hours ago": k + " hour ago"
                        } else {
                            if (l < c) {
                                return "approximately " + Math.round(l / h) + " days ago"
                            } else {
                                if (l < b) {
                                    return "approximately " + Math.round(l / c) + " months ago"
                                } else {
                                    return "approximately " + Math.round(l / b) + " years ago"
                                }
                            }
                        }
                    }
                }
            },
            formatEventDesc: function(d) {
                var f = Registry.socialActivityEventTypes;
                var h;
                var c = 10;
                var g;
                var b;
                var e;
                switch (d.eventType) {
                case f.openPosition:
                    g = a.instruments.getById(d.instrumentID + "");
                    e = (d.direction * 1 == 1) ? "Call": "Put";
                    h = Registry._["activity-event-open-position"].replace("[[[option-name]]]", "<b>" + g.data.name + "</b>").replace("[[[option-type]]]", ' <span class="' + e.toLowerCase() + '">Binary ' + e + "</span>").replace("[[[expiry]]]", ' <span class="' + e.toLowerCase() + '">' + (d.strike * 1) + "</span>");
                    break;
                case f.closePosition:
                    b = Trading.app.getController("Game").getTradeStatus({
                        data: d
                    });
                    h = '<span class="gain">' + Registry._["activity-event-close-position"].replace("[[[amount]]]", (b.payoff).toFixed(2)) + "</span>";
                    break;
                case f.topDayPnl:
                    h = Registry._["activity-event-top-day-pnl"];
                    break;
                case f.topDayPnlFirst:
                    h = Registry._["activity-event-top-day-pnl-first"];
                    break;
                case f.topDayWinRatio:
                    h = Registry._["activity-event-top-day-win-ratio"];
                    break;
                case f.topDayWinRatioFirst:
                    h = Registry._["activity-event-top-day-win-ratio-first"];
                    break;
                case f.topWeekPnl:
                    h = Registry._["activity-event-top-week-pnl"];
                    break;
                case f.topWeekPnlFirst:
                    h = Registry._["activity-event-top-week-pnl-first"];
                    break;
                case f.topWeekWinRatio:
                    h = Registry._["activity-event-top-week-win-ratio"];
                    break;
                case f.topWeekWinRatioFirst:
                    h = Registry._["activity-event-top-week-win-ratio-first"];
                    break;
                case f.likedTrade:
                    h = Registry._["activity-event-like-trade"];
                    break;
                default:
                    h = d.eventType
                }
                h = h.replace("[[[nickname]]]", "<b>" + d.nickname + "</b>").replace("[[[limit]]]", c);
                return h
            }
        };
        this.tplActivityEntry = new Ext.XTemplate('<li id="activity-entry-{eventID}" class="activity-entry trade-entry">', '<div class="social-user-img-container">', '<img id="advanced-social-trade-img-{eventID}" class="social-user-img" src="{userID:this.setPublicImage}" />', '<img class="social-user-arrow-img {[(values.direction) ? "" : "x-hidden"]}" src=\'{[(values.direction == 1) ? "images/small-green-arrow-up-10x11.png" : "images/small-red-arrow-down-10x11.png"]}\' />', "</div>", '<div class="activity-entry-info-container">', "<span>{[this.formatEventDesc(values)]}</span>", "<br>", '<span id="activity-entry-time-{eventID}" class="entry-time" data-timestamp="{timestamp}">{timestamp:this.formatTime}</span>', "</div>", '<a href="#" class="activity-entry-extend-link" onclick="Trading.app.getController(\'Game\').showAdvancedChart(\'{instrumentID}\'); return false;">{[((values.eventType == Registry.socialActivityEventTypes.openPosition) || (values.eventType == Registry.socialActivityEventTypes.closePosition)) ? "View on chart" : ""]}</a>', "</li>", this.tplActivityEntryFunctions);
        this.tplSmallActivityEntry = new Ext.XTemplate('<li id="activity-entry-{eventID}" class="small-activity-entry trade-entry">', '<div class="social-user-img-container">', '<img id="advanced-social-trade-img-{eventID}" class="social-user-img" src="{userID:this.setPublicImage}" />', '<img class="social-user-arrow-img {[(values.direction) ? "" : "x-hidden"]}" src=\'{[(values.direction == 1) ? "images/small-green-arrow-up-10x11.png" : "images/small-red-arrow-down-10x11.png"]}\' />', "</div>", '<div class="small-activity-entry-info-container">', "<span>{[this.formatEventDesc(values)]}</span>", "<br>", '<span id="activity-entry-time-{eventID}" class="entry-time" data-timestamp="{timestamp}">{timestamp:this.formatTime}</span>', '<a href="#" class="small-activity-entry-extend-link" onclick="Trading.app.getController(\'Game\').showAdvancedChart(\'{instrumentID}\'); return false;">{[((values.eventType == Registry.socialActivityEventTypes.openPosition) || (values.eventType == Registry.socialActivityEventTypes.closePosition)) ? "View on chart" : ""]}</a>', "</div>", "</li>", this.tplActivityEntryFunctions);
        this.tplActivity = new Ext.XTemplate('<ul id="activity-panel-{instrumentID}" class="activity-panel empty {[Registry["socialUser"] ? "" : "x-hidden"]}" >', '<li class="loading-activity">', "<span>Loading Social Activity</span>", '<span class="loadable loading">&nbsp;</span>', "</li>", "</ul>", '<div class="activity-panel-enable-social-container {[Registry["socialUser"] ? "x-hidden" : ""]}">', '<div class="advanced-chart-social-enable-mask"></div>', '<div class="advanced-chart-social-enable-msg">', '<a href="' + Registry.socialUrl + '" onclick="return Trading.app.getController(\'User\').forceLogin();">' + Registry._["social-settings-enable-social"] + "</a> " + Registry._["social-enable-social-activity"], "</div>", "</div>", {});
        this.SmalltplActivity = new Ext.XTemplate('<ul id="activity-panel-{instrumentID}" class="small-activity-panel empty {[Registry["socialUser"] ? "" : "x-hidden"]}" >', '<li class="loading-activity">', "<span>Loading Social Activity</span>", '<span class="loadable loading">&nbsp;</span>', "</li>", "</ul>", '<div class="activity-panel-enable-social-container {[Registry["socialUser"] ? "x-hidden" : ""]}">', '<div class="advanced-chart-social-enable-mask"></div>', '<div class="advanced-chart-social-enable-msg">', '<a href="' + Registry.socialUrl + '" onclick="return Trading.app.getController(\'User\').forceLogin();">' + Registry._["social-settings-enable-social"] + "</a> " + Registry._["social-enable-social-activity"], "</div>", "</div>", {});
        this.tplProgressBar = new Ext.XTemplate('<div id="progress-bar-{instrumentID}" class="x-progress x-progress-default">', '<div class="x-progress-text x-progress-text-back progress-bar-text" id="progress-bar-text-{instrumentID}-bottom"></div>', '<div id="progress-bar-{instrumentID}-value" class="x-progress-bar">', '<div class="x-progress-text" id="progress-bar-text-{instrumentID}-top"></div>', "</div>", "</div>");
        this.tplInvoice = new Ext.XTemplate('<div class="message-container">', "<table>", "<tr><td>" + Registry._["trade-info-to-close"] + ':</td><td><div class="close-button" onclick="Trading.app.getController(\'Game\').hideInvoice(\'{instrumentID}\')"></div>{direction:this.formatDirection} <span id="invoice-spot-{instrumentID}" class="spot-{instrumentID}">{last}</span></td></tr>', "<tr><td>" + Registry._["trade-info-expires"] + ":</td><td>{expiry:this.formatExpiry}</td></tr>", '<tr><td valign="middle">' + Registry._["trade-info-investment"] + ':</td><td><div class="investment-amount-wrapper {[this.longCurrencySymbolClass()]}"><span class="invoice-currency-symbol">{[this.formatCurrencySymbol()]}</span><input type="text" class="investment-amount" id="investment-amount-{instrumentID}" onchange="Utils.validateStake(event, this); Trading.app.getController(\'Game\').setReturnAmount(\'{instrumentID}\', {payout}, {rebate})" onkeyup="Utils.validateStake(event, this); Trading.app.getController(\'Game\').setReturnAmount(\'{instrumentID}\', {payout}, {rebate})" onpaste="Utils.validateStake(event, this); Trading.app.getController(\'Game\').setReturnAmount(\'{instrumentID}\', {payout}, {rebate})" onblur="Utils.validateStake(event, this); Trading.app.getController(\'Game\').setReturnAmount(\'{instrumentID}\', {payout}, {rebate})" /></div></td></tr>', "<tr><td>" + Registry._["in-the-money"] + ':</td><td class="cf"><span id="invoice-payout-{instrumentID}">{formattedPayout}</span></td></tr>', "<tr><td>" + Registry._["out-the-money"] + ':</td><td><span id="invoice-rebate-{instrumentID}">{rebate}%</span></td></tr>', '<tr><td class="apply-wrapper" colspan="2"><a href="#" onclick="Trading.app.getController(\'Game\').trade(\'{instrumentID}\'); return false;" class="button button-trade" id="apply-{instrumentID}">' + Registry._["button-trade"] + '</a><span class="loadable" id="loader-{instrumentID}">&nbsp;</span></td></tr>', "</table>", "</div>", {
            formatExpiry: function(c) {
                var b = new Date(c * 1);
                return Ext.Date.format(b, "d-M H:i")
            },
            formatDirection: function(b) {
                return (b == "-1") ? '<div class="put-small-icon"></div>': '<div class="call-small-icon"></div>'
            },
            formatCurrencySymbol: function() {
                var c = Trading.app.getController("Game");
                var b = c.getUserCurrencyInfo().currencySymbol;
                return b
            },
            longCurrencySymbolClass: function() {
                var c = Trading.app.getController("Game");
                var b = c.getUserCurrencyInfo().currencySymbol;
                return (b.length > 1) ? "long-currency-symbol": ""
            }
        });
        this.tplGameIndicators = new Ext.XTemplate('<ul id="game-indicators-menu-{instrumentID}" class="game-indicators-menu">', '<tpl for="indicators">', '<li id="game-indicator-{parent.instrumentID}-{type}" title="{title}" class="{[(xindex == 1) ? "first" : ""]} {[(xcount == xindex) ? "last" : ""]}">', '<span class="game-indicator-icon {type}">&nbsp;</span>', "<span>{name}</span>", "</li>", "</tpl>", "</ul>");
        this.tplGameTypesMenu = new Ext.XTemplate('<ul id="game-types-menu-{instrumentID}" class="game-types-menu">', '<tpl for="gameTypes">', '<li id="game-type-{parent.instrumentID}-{type}" class="{[(xindex == 1) ? "first" : ""]} {[(xcount == xindex) ? "last" : ""]} {[(parent.defaultGameType == values.type) ? "active" : ""]} {[(values.enabled) ? "" : "disabled"]}" onclick="Trading.app.getController(\'Game\').setGameType(\'{parent.instrumentID}\', {type}, {enabled}); if ({type} != 3) { Ext.select(\'#game-types-menu-{parent.instrumentID} li.active\').first().removeCls(\'active\'); Ext.fly(\'game-type-{parent.instrumentID}-{type}\').addCls(\'active\'); }">', '<a href="#" onclick="return false;">', '<span class="game-type-icon-{type}">&nbsp;</span>', "<strong>{name}</strong>", "</a>", '<tpl if="values.type == 7">', '<div class="game-type-weekend-option-help" onclick="Trading.app.getController(\'User\').showWeekendOptionHelp(); return false;">&nbsp;</div>', "</tpl>", "</li>", "</tpl>", "</ul>");
        this.tplSmallGameTypesMenu = new Ext.XTemplate('<ul id="game-types-menu-{instrumentID}" class="small-game-types-menu">', '<tpl for="gameTypes">', '<li id="game-type-{parent.instrumentID}-{type}" class="{[(xindex == 1) ? "first" : ""]} {[(xcount == xindex) ? "last" : ""]} {[(parent.defaultGameType == values.type) ? "active" : ""]} {[(values.enabled) ? "" : "disabled"]}" onclick="Trading.app.getController(\'Game\').setGameType(\'{parent.instrumentID}\', {type}, {enabled}); if ({type} != 3) { Ext.select(\'#game-types-menu-{parent.instrumentID} li.active\').first().removeCls(\'active\'); Ext.fly(\'game-type-{parent.instrumentID}-{type}\').addCls(\'active\'); }">', '<a href="#" onclick="return false;">', "<strong>{name}</strong>", "</a>", "</li>", "</tpl>", "</ul>");
        this.tplInstrumentInfo = new Ext.XTemplate('<h4><b>{name}{[values.futureExpirationDate ? "-" + values.futureExpirationDate : ""]}</b></h4>', "<p>{[this.htmlEscape(values.description)]}</p>", "<br/>", "<span><b>" + Registry._["expiry-formula"] + ": </b></span>", "<span>{[this.htmlEscape(values.expiry)]}</span>", "<br/>", "<br/>", "<span><b>" + Registry._["feed-source"] + ": </b></span>", "<span>{provider}</span>", {
            htmlEscape: function(b) {
                return Utils.htmlEscape(b)
            }
        });
        this.tplAskBidInfo = new Ext.XTemplate("<h4><b>" + Registry._["strike-rate"] + "</b></h4>", "<p>" + Utils.htmlEscape(Registry._["strike-rate-text"]) + "</p>", "<br/>", "<h4><b>" + Registry._["ask-bid-rates"] + "</b></h4>", "<p>" + Utils.htmlEscape(Registry._["ask-bid-rates-text"]) + "</p>");
        this.gameTemplateFunctions = {
            renderProgressBar: function(b) {
                return a.tplProgressBar.apply(b)
            },
            renderMore: function(b) {
                return a.tplMore.apply(b)
            },
            renderActivity: function(b) {
                if (a.selectedGameTemplate == "regular") {
                    return a.tplActivity.apply(b)
                } else {
                    return a.SmalltplActivity.apply(b)
                }
            },
            renderQuestion: function(b) {
                return Registry._["game-question"].replace("[[[instrument]]]", '<span class="question-instrument-name">' + b + "</span>")
            },
            renderGameTypesMenu: function(b) {
                return a.renderGameTypesMenu(b)
            },
            renderInstrumentInfo: function(b) {
                return a.renderInstrumentInfo(b)
            },
            renderAskBidInfo: function(b) {
                return a.renderAskBidInfo(b)
            },
            renderIndicators: function(b) {
                return a.renderIndicators(b, a.getDefaultGameType(b), false)
            },
            getDefaultGameType: function(b) {
                return a.getDefaultGameType(b)
            },
            formatInstrumentName: function(b) {
                var c = 11;
                if (a.selectedGameTemplate == "financial") {
                    c = 10
                }
                if (b.length <= c) {
                    return b
                } else {
                    return (b.substr(0, c) + "...")
                }
            },
            renderFormattedSpot: function(b, c) {
                return c ? a.formatSpot(b, c) : "-"
            },
            showGameInfo: function() {
                return a.showGameInfo
            }
        };
        this.tplGame = new Ext.XTemplate("<!-- game begins -->", '<div class="game" id="game-{instrumentID}" data-spot="{last}" data-payout="{payout}" data-rebate="{rebate}" data-game-type="{[this.getDefaultGameType(values.instrumentID)]}">', '<div class="cf game-row">', '<a class="instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;" title="{name}">{name:this.formatInstrumentName}</a>', '<tpl if="values.description && this.showGameInfo()">', '<span id="game-info-{instrumentID}" class="game-info-icon instrument-desc"  tooltip-content="{[this.renderInstrumentInfo(values)]}">&nbsp;</span>', "</tpl>", "{[this.renderGameTypesMenu(values.instrumentID)]}", '<select class="game-expiry-box" id="game-expiry-box-{instrumentID}" onchange="Trading.app.getController(\'Game\').selectExpiry(\'{instrumentID}\', this.value, true)"><option value="">xxx</option></select>', '<span class="game-expiry-label" id="game-expiry-label-{instrumentID}">' + Registry._["game-label-expiry"] + ":</span>", '<ul class="game-short-expiry-options" id="game-short-expiry-options-{instrumentID}">', "</ul>", '<div class="game-short-expiry-tooltip" id="game-short-expiry-tooltip-{instrumentID}"></div>', '<div class="game-short-expiry-tooltip-arrow" id="game-short-expiry-tooltip-arrow-{instrumentID}"></div>', "</div>", '<div class="cf game-row game-row-2">', '<span class="game-description"><span class="instrument-icon instrument-icon-{instrumentID}"></span>{name:this.renderQuestion}</span>', '<div class="closing-progress-bar-container x-hidden" id="closing-progress-bar-container-{instrumentID}">{[this.renderProgressBar(values)]}</div>', '<span class="time-to-trade-label x-hidden" id="time-to-trade-label-{instrumentID}">' + Registry._["game-label-time-remaining"] + ":</span>", "</div>", '<div class="cf game-main-content">', '<div class="chart-indicator" id="chart-indicator-{instrumentID}"></div>', '<div class="chart-bg top" id="chart-top-bg-{instrumentID}"></div>', '<div class="chart-bg bottom" id="chart-bottom-bg-{instrumentID}"></div>', '<div class="chart-wrapper" id="chart-wrapper-{instrumentID}"></div>', '<div id="show-more-container-{instrumentID}" class="show-more-container">', '<a href="#" onclick="Trading.app.getController(\'Game\').expand({instrumentID}); return false;" class="show-more" id="show-more-{instrumentID}">', '<span class="show-more-icon">&nbsp;</span>', "<span>" + Registry._.more + "</span>", "</a>", '<a href="#" onclick="Trading.app.getController(\'Game\').expand({instrumentID}, \'activity\'); return false;" class="show-more" style="{[Trading.app.getController("Game").isGameSocial(values.instrumentID) ? "" : "display: none;"]}" id="show-more-activity-{instrumentID}">', '<span class="show-more-icon more-activity">&nbsp;</span>', "<span>" + Registry._.social + "</span>", "</a>", '<a href="#" onclick="Trading.app.getController(\'Game\').showAdvancedChart(\'{instrumentID}\'); return false;" class="show-more" id="show-more-chart-{instrumentID}">', '<span class="show-more-icon more-advanced-chart">&nbsp;</span>', "<span>Chart</span>", "</a>", '<tpl if="this.showGameInfo()">', '<div id="ask-bid-container-{instrumentID}" class="ask-bid-container">', '<span class="game-info-icon ask-bid-desc"  tooltip-content="{[this.renderAskBidInfo(values)]}">&nbsp;</span>', '<div class="ask-bid-value"><span>' + Registry._.Bid + ':</span>&nbsp;<span id="bid-{instrumentID}">-</span></div>', '<div class="ask-bid-value"><span>' + Registry._.Ask + ':</span>&nbsp;<span id="ask-{instrumentID}">-</span></div>', "</div>", "</tpl>", "</div>", '<div class="game-form-wrapper cf">', '<div class="game-form-buttons-wrapper">', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', 1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', 1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button call\">" + Registry._["label-above"] + "</a>", '<span class="spot formatted-spot-{instrumentID} highlight">{[this.renderFormattedSpot(values.instrumentID, values.last)]}</span>', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', -1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', -1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button put\">" + Registry._["label-below"] + "</a>", "</div>", '<div class="game-form-invoice-wrapper" id="game-form-invoice-wrapper-{instrumentID}">', '<div class="payout" id="payout-wrapper-{instrumentID}">', '<div id="payout-{instrumentID}">{payout}%</div>', '<div class="payout-text">', "<span>" + Registry._["trade-info-payout"] + "</span>", '<span id="game-indicators-{instrumentID}">{[this.renderIndicators(values.instrumentID)]}</span>', "</div>", "</div>", '<div class="invoice" style="display: none;" id="invoice-{instrumentID}" data-active="false"></div>', '<div class="message-container confirmation-message" style="display: none;" id="confirmation-message-{instrumentID}"></div>', "</div>", "</div>", "</div>", '<div class="cf more" id="more-{instrumentID}">{[this.renderMore(values)]}</div>', '<div class="cf more" id="more-activity-{instrumentID}">{[this.renderActivity(values)]}</div>', "</div>", "<!-- game ends -->", this.gameTemplateFunctions);
        this.gameClosedTemplateFunctions = {
            formatOpensAt: function(b) {
                var c = Trading.app.getController("Game");
                return c.formatOpensAt(b)
            }
        };
        this.tplGameClosed = new Ext.XTemplate("<!-- game closed begins -->", '<div class="game" id="game-{instrumentID}">', '<div class="cf game-row game-row-3 closed-game">', '<a class="instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;">{name}</a>', '<span class="game-closed-message">{opensAt:this.formatOpensAt}</span>', "</div>", "</div>", "<!-- game closed ends -->", this.gameClosedTemplateFunctions);
        this.tplSmallGameClosed = new Ext.XTemplate("<!-- game closed begins -->", '<div class="small-game" id="game-{instrumentID}">', '<div class="cf small-game-row small-game-row-3 closed-small-game">', '<a class="instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;">{name}</a>', '<span class="small-game-closed-message">{opensAt:this.formatOpensAt}</span>', "</div>", "</div>", "<!-- game closed ends -->", this.gameClosedTemplateFunctions);
        this.tplFinancialViewGameClosed = new Ext.XTemplate("<!-- game closed begins -->", '<div class="game" id="game-{instrumentID}">', '<div class="cf game-row game-row-3 closed-game">', '<a class="instrument-name instrument-name-closed" id="instrument-name-{instrumentID}" href="#" onclick="Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;">{name}</a>', '<span class="game-closed-message">{opensAt:this.formatOpensAt}</span>', "</div>", "</div>", "<!-- game closed ends -->", this.gameClosedTemplateFunctions);
        this.tplSmallGame = new Ext.XTemplate("<!-- small game begins -->", '<div class="small-game  {[this.showGameInfo() ? "game-info" : ""]}" id="game-{instrumentID}" data-spot="{last}" data-payout="{payout}" data-rebate="{rebate}" data-game-type="{[this.getDefaultGameType(values.instrumentID)]}">', '<div class="small-game-header">', '<div class="small-game-header-left">', '<a class="small-instrument-name instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;" title="{name}"><span>{name:this.formatInstrumentName}</span></a>', '<tpl if="values.description && this.showGameInfo()">', '<span id="game-info-{instrumentID}" class="game-info-icon instrument-desc"  tooltip-content="{[this.renderInstrumentInfo(values)]}">&nbsp;</span>', "</tpl>", "</div>", '<div class="small-game-header-right">', "{[this.renderGameTypesMenu(values.instrumentID)]}", "</div>", "</div>", '<div class="small-game-second-row">', '<select class="game-expiry-box" id="game-expiry-box-{instrumentID}" onchange="Trading.app.getController(\'Game\').selectExpiry(\'{instrumentID}\', this.value, true)"><option value="">xxx</option></select>', '<span class="game-expiry-label" id="game-expiry-label-{instrumentID}">' + Registry._["game-label-expiry"] + ":</span>", '<ul class="game-short-expiry-options small-game-short-expiry" id="game-short-expiry-options-{instrumentID}">', "</ul>", '<span class="game-expiry-label" id="game-short-expiry-tooltip-arrow-{instrumentID}">' + Registry._["game-label-expiry"] + ":</span>", "</div>", '<div class="small-game-content">', '<div class="small-game-content-row">', '<span class="game-description"><span class="instrument-icon instrument-icon-{instrumentID}"></span>{name:this.renderQuestion}</span>', "</div>", '<div class="small-game-content-row">', '<div class="game-form-wrapper small-game-form-wrapper" >', '<div class="small-game-form-buttons-wrapper">', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', 1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', 1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button call\">" + Registry._["label-above"] + "</a>", '<span class="spot formatted-spot-{instrumentID} highlight">{[this.renderFormattedSpot(values.instrumentID, values.last)]}</span>', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', -1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', -1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button put\">" + Registry._["label-below"] + "</a>", "</div>", '<div class="game-form-invoice-wrapper" id="game-form-invoice-wrapper-{instrumentID}"  style="display: block;">', '<span class="time-to-trade-label x-hidden" style="display: none;" id="time-to-trade-label-{instrumentID}">' + Registry._["game-label-time-remaining"] + ":</span>", '<div class="small-payout" id="payout-wrapper-{instrumentID}">', '<div class="closing-progress-bar-container x-hidden" id="closing-progress-bar-container-{instrumentID}">{[this.renderProgressBar(values)]}</div>', '<div class="payout-value" id="payout-{instrumentID}">{payout}%</div>', '<div class="payout-text">', "<span>" + Registry._["trade-info-payout"] + "</span>", '<span id="game-indicators-{instrumentID}">{[this.renderIndicators(values.instrumentID)]}</span>', "</div>", "</div>", '<div class="invoice" style="display: none;" id="invoice-{instrumentID}" data-active="false"></div>', '<div class="message-container confirmation-message" style="display: none;" id="confirmation-message-{instrumentID}"></div>', "</div>", "</div>", "</div>", '<div class="small-game-content-row small-game-chart">', '<div class="chart-bg top" id="chart-top-bg-{instrumentID}"></div>', '<div class="chart-bg bottom" id="chart-bottom-bg-{instrumentID}"></div>', '<div class="chart-wrapper small-chart-wrapper" id="chart-wrapper-{instrumentID}"></div>', '<div class="chart-indicator" id="chart-indicator-{instrumentID}"></div>', "</div>", '<div class="small-game-content-row">', '<div class="{[this.showGameInfo() ? "small-show-more-ask-bid-container" : ""]}">', '<div id="show-more-container-{instrumentID}" class="small-show-more-container">', '<a href="#" onclick="Trading.app.getController(\'Game\').expand({instrumentID}); return false;" class="show-more" id="show-more-{instrumentID}">', '<span class="show-more-icon">&nbsp;</span>', "<span>" + Registry._.more + "</span>", "</a>", '<a href="#" onclick="Trading.app.getController(\'Game\').expand({instrumentID}, \'activity\'); return false;" class="show-more" style="{[Trading.app.getController("Game").isGameSocial(values.instrumentID) ? "" : "display: none;"]}" id="show-more-activity-{instrumentID}">', '<span class="show-more-icon more-activity">&nbsp;</span>', "<span>" + Registry._.social + "</span>", "</a>", '<a href="#" onclick="Trading.app.getController(\'Game\').showAdvancedChart(\'{instrumentID}\'); return false;" class="show-more" id="show-more-chart-{instrumentID}">', '<span class="show-more-icon more-advanced-chart">&nbsp;</span>', "<span>Chart</span>", "</a>", "</div>", '<tpl if="this.showGameInfo()">', '<div id="ask-bid-container-{instrumentID}" class="ask-bid-container">', '<span class="game-info-icon ask-bid-desc"  tooltip-content="{[this.renderAskBidInfo(values)]}">&nbsp;</span>', '<div class="ask-bid-value"><span>' + Registry._.Bid + ':</span>&nbsp;<span id="bid-{instrumentID}">-</span></div>', '<div class="ask-bid-value"><span>' + Registry._.Ask + ':</span>&nbsp;<span id="ask-{instrumentID}">-</span></div>', "</div>", "</tpl>", "</div>", "</div>", '<div class="cf more small-more" id="more-{instrumentID}">{[this.renderMore(values)]}</div>', '<div class="cf more small-more-activity" id="more-activity-{instrumentID}">{[this.renderActivity(values)]}</div>', "</div>", "</div>", "<!-- small game ends -->", this.gameTemplateFunctions);
        this.tplGames = new Ext.XTemplate('<div class="games">', '<tpl for=".">', '<div class="{[(xindex == 1) ? "first" : ""]} {[(xcount == xindex) ? "last" : ""]}" id="game-container-{[values.data.instrumentID]}" data-state="{[(values.data.isOpen) ? "open" : "closed"]}">{[this.renderGame(values)]}</div>', "</tpl>", "</div>", {
            renderGame: function(b) {
                var c = (b.data.isOpen) ? a.tplGame: a.tplGameClosed;
                return c.apply(b.data)
            }
        });
        this.tplSmallGameContainers = new Ext.XTemplate('<div class="game-small-containers">', '<tpl for=".">', '<div id="games-container-{[xindex]}">{[this.renderSmallGames(values)]}</div>', "</tpl>", "</div>", {
            renderSmallGames: function(b) {
                var c = a.tplSmallGames;
                return c.apply(b)
            }
        });
        this.tplSmallGames = new Ext.XTemplate('<div class="smallGames">', '<tpl for=".">', '<div id="game-container-{[values.data.instrumentID]}" data-state="{[(values.data.isOpen) ? "open" : "closed"]}">{[this.renderGame(values)]}</div>', "</tpl>", "</div>", {
            renderGame: function(b) {
                var c = (b.data.isOpen) ? a.tplSmallGame: a.tplSmallGameClosed;
                return c.apply(b.data)
            }
        });
        this.tplFinancialViewGame = new Ext.XTemplate('<h3 id="game-{instrumentID}"  data-spot="{last}" data-payout="{payout}" data-rebate="{rebate}" data-game-type="{[this.getDefaultGameType(values.instrumentID)]}">', '<span class="instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="var event = arguments[0] || window.event; event.stopPropagation(); Trading.app.getController(\'Game\').star(\'{instrumentID}\'); return false;">&nbsp</span>\n<div class="list-instrument-name-container" title="{name}"><span class="instrument-name-text">{name:this.formatInstrumentName}</span></div>', '<span class="list-spot spot-trend-{instrumentID} header-spot formatted-spot-{instrumentID} highlight">{[this.renderFormattedSpot(values.instrumentID, values.last)]}</span>', '<div class="list-progress-bar closing-progress-bar-container x-hidden" id="closing-progress-bar-container-{instrumentID}" style="{[(values.isOpen) ? "" : "visibility: hidden;"]}">{[this.renderProgressBar(values)]}</div>', '<span class="drag-drop">&nbsp</span>', "</h3>", "<div>{[this.renderFinancialViewGameBox(values)]}</div>", {
            renderFinancialViewGameBox: function(b) {
                return a.tplFinancialViewGameBox.apply(b)
            }
        },
        this.gameTemplateFunctions);
        this.tplFinancialViewGameBox = new Ext.XTemplate('<div class="big-game-right-row-2">', '<div class="game-form-buttons-wrapper">', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', -1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', -1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button call {[this.renderLanguageClass()]}\">" + Registry._["label-above"] + "</a>", '<span class="spot spot-trend-{instrumentID} formatted-spot-{instrumentID} highlight">{[this.renderFormattedSpot(values.instrumentID, values.last)]}</span>', "<a href=\"#\" onclick=\"Trading.app.getController('Game').direction('{instrumentID}', 1); return false;\" onmouseover=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', 1, true); return false;\" onmouseout=\"Trading.app.getController('Game').setChartBackground('{instrumentID}', false, true); return false;\" class=\"button button-medium direction-button put {[this.renderLanguageClass()]}\">" + Registry._["label-below"] + "</a>", "</div>", "</div>", '<div class="big-game-right-row">', '<div class="game-form-invoice-wrapper" id="game-form-invoice-wrapper-{instrumentID}">', '<div class="payout" id="payout-wrapper-{instrumentID}">', '<div id="payout-{instrumentID}">{payout}%</div>', '<div class="payout-text">', "<span>" + Registry._["trade-info-payout"] + "</span>", '<span id="game-indicators-{instrumentID}">{[this.renderIndicators(values.instrumentID)]}</span>', "</div>", "</div>", '<div class="invoice" style="display: none;" id="invoice-{instrumentID}" data-active="false"></div>', '<div class="message-container confirmation-message" style="display: none;" id="confirmation-message-{instrumentID}"></div>', "</div>", "</div>", {
            renderLanguageClass: function() {
                return "lang-" + Registry.lang
            }
        },
        this.gameTemplateFunctions);
        this.tplFinancialViewChartWrapper = new Ext.XTemplate('<div class="chart-indicator" id="chart-indicator-{instrumentID}"></div>', '<div class="chart-plot-bg"></div>', '<div class="chart-bg top" id="chart-top-bg-{instrumentID}"></div>', '<div class="chart-bg bottom" id="chart-bottom-bg-{instrumentID}"></div>', '<div class="bottom-container {[this.showGameInfo() ? "ask-bid-and-sentiment" : ""]}">', '<div class="game-extended-info" id="game-extended-info-{instrumentID}"></div>', '<tpl if="this.showGameInfo()">', '<div id="ask-bid-container-{instrumentID}" class="ask-bid-container">', '<span class="game-info-icon ask-bid-desc"  tooltip-content="{[this.renderAskBidInfo(values)]}">&nbsp;</span>', '<div class="ask-bid-value"><span>' + Registry._.Bid + ':</span>&nbsp;<span id="bid-{instrumentID}">-</span></div>', '<div class="ask-bid-value"><span>' + Registry._.Ask + ':</span>&nbsp;<span id="ask-{instrumentID}">-</span></div>', "</div>", "</tpl>", "</div>", '<div class="big-game-chart-wrapper chart-wrapper chart-wrapper-hidden" id="chart-wrapper-{instrumentID}" style="visibility: hidden;"></div>', '<div class="big-game-chart-wrapper chart-wrapper chart-wrapper-hidden" id="chart-candlestick-wrapper-{instrumentID}" style="display: block;"></div>', '<div class="top-container {[this.showGameInfo() ? "menu-and-name" : ""]}">', '<div class="top-container-select-div">', '<select class="instrument-name-list" style="display:none;">', "<option>USD</option>", "<option>USD</option>", "<option>USD</option>", "</select>", "</div>", '<tpl if="this.showGameInfo()">', '<div class="instrument-name-container">', '<div class="instrument-name-on-chart" id="instrument-name-{instrumentID}"><span id="instrument-name-{instrumentID}">{name:this.formatInstrumentName}</span></div>', '<tpl if="values.description">', '<span class="game-info-icon instrument-desc"  tooltip-content="{[this.renderInstrumentInfo(values)]}">&nbsp;</span>', "</tpl>", "</div>", "</tpl>", '<div class="big-gamebox-menu-icons">', '<a class="menu-icons increase-icon {[this.renderDisabledIncreaseIcon()]}" id="financial-view-increase-icon" href="#" onclick="Trading.app.getController(\'Game\').zoomChart(\'in\'); return false;"></a>', '<a class="menu-icons reduce-icon {[this.renderDisabledReduceIcon()]}" id="financial-view-reduce-icon" href="#" onclick="Trading.app.getController(\'Game\').zoomChart(\'out\'); return false;"></a>', '<a class="menu-icons adv-chart-icon {[this.renderAdvancedChartIcon()]}" id="financial-view-advanced-chart-icon" href="#" onclick="Trading.app.getController(\'Game\').toggleFinancialViewChart(); return false;"></a>', '<a class="menu-icons social-icon {[this.renderActiveSocialIcon()]}" href="#" style="{[this.hideSocialIcon()]}" id="financial-view-social-icon" onclick="$(\'#show-social-trades-indicators-checkmark\').trigger(\'click\'); return false;"></a>', "</div>", "</div>", {
            renderDisabledIncreaseIcon: function() {
                return (a.zoomLevelIndex === a.zoomLevels.length - 1) ? "disabled": ""
            },
            renderDisabledReduceIcon: function() {
                return (a.zoomLevelIndex === 0) ? "disabled": ""
            },
            renderAdvancedChartIcon: function() {
                return (a.selectedChartType === "line") ? "candlestick": "line"
            },
            renderActiveSocialIcon: function() {
                return ($("#show-social-trades-indicators-checkmark").attr("checked") === "checked") ? "active": ""
            },
            hideSocialIcon: function(b) {
                if (!Registry.userID || a.selectedChartType !== "line") {
                    return "display: none;"
                }
            },
            formatInstrumentName: function(b) {
                var c = 11;
                if (a.selectedGameTemplate == "financial") {
                    c = 10
                }
                if (b.length <= c) {
                    return b
                } else {
                    return (b.substr(0, c) + "...")
                }
            },
            renderInstrumentInfo: function(b) {
                return a.renderInstrumentInfo(b)
            },
            renderAskBidInfo: function(b) {
                return a.renderAskBidInfo(b)
            },
            showGameInfo: function() {
                return a.showGameInfo
            }
        });
        this.tplFinancialViewGameExpiry = new Ext.XTemplate("{[this.renderFinancialViewGameTypesMenu(values)]}", '<select class="game-expiry-box" id="game-expiry-box-{instrumentID}" onchange="Trading.app.getController(\'Game\').selectExpiry(\'{instrumentID}\', this.value, true)"><option value="">xxx</option></select>', '<span class="game-expiry-label" id="game-expiry-label-{instrumentID}">' + Registry._["game-label-expiry"] + ":</span>", '<ul class="game-short-expiry-options" id="game-short-expiry-options-{instrumentID}">', "</ul>", '<div class="game-short-expiry-tooltip" id="game-short-expiry-tooltip-{instrumentID}"></div>', '<div class="game-short-expiry-tooltip-arrow" id="game-short-expiry-tooltip-arrow-{instrumentID}"></div>', '<select onchange="Trading.app.getController("Game").selectExpiry("1", this.value, true)" id="game-expiry-box-{instrumentID}" class="game-expiry-box" style="display: none;">', "</select>", '<span id="game-expiry-label-{instrumentID}" class="game-expiry-label" style="display: none;">Expiry:</span>', {
            renderFinancialViewGameTypesMenu: function(b) {
                return a.renderGameTypesMenu(b.instrumentID)
            }
        });
        this.tplFinancialView = new Ext.XTemplate('<div class="big-gamebox">', '<div class="big-gamebox content-right">', '<div id="about" class="nano">', '<div class="nano-content">', '<ul id="accordion" class="sortable-list">', '<tpl for=".">', '<li class="sortable-item" id="game-container-{data.instrumentID}" data-state="{[(values.data.isOpen) ? "open" : "closed"]}">', "{[this.renderFinancialViewGame(values)]}", "</li>", "</tpl>", "</ul>", "</div>", "</div>", "</div>", '<div class="big-gamebox content-left">', '<div class="cf game-row big-game-row big-game-row-first" id="expiry-container">', '<div id="financial-game-expiry-wrapper">', "{[this.renderFinancialViewGameExpiry(values)]}", "</div>", "</div>", '<div class="cf game-row big-game-chart-row" id="chart-container">', '<div class="chart-wrapper-container" id="chart-wrapper">', "{[this.renderFinancialViewChartWrapper(values)]}", "</div>", "</div>", '<div class="cf game-row big-game-chart-row" id="closed-game-container" style="display: none;">', '<div class="closed-wrapper-container" id="closed-game-wrapper">', "{[this.renderFinancialViewGameClosedWrapper(values)]}", "</div>", "</div>", "</div>", "</div>", '<iframe class="sentiment-iframe" src="' + Registry.scheme + "://widgets." + Registry.domain + "/" + Registry.lang + '/widget/sentiment?types=1,2,3,4&openByDefault=1,2,3,4&numberOfRows=4&showSentiment=1&selectInstrumentOnClick=1&customCSS=financial-view-class">', "</iframe>", {
            renderFinancialViewGame: function(b) {
                return a.tplFinancialViewGame.apply(b.data)
            },
            renderFinancialViewChartWrapper: function(b) {
                return a.tplFinancialViewChartWrapper.apply(b[0].data)
            },
            renderFinancialViewGameExpiry: function(b) {
                return a.tplFinancialViewGameExpiry.apply(b[0].data)
            },
            renderFinancialViewGameClosedWrapper: function(b) {
                if (!b[0].data.isOpen) {
                    return a.tplFinancialViewGameClosed.apply(b[0].data)
                } else {
                    return ""
                }
            }
        },
        this.gameTemplateFunctions);
        this.tplPagination = new Ext.XTemplate('<ul id="pagination" class="cf horizontal-list" style="float: right; margin: 10px 0;">', '<tpl for=".">', '<li class="{[(xcount == xindex) ? "last" : ""]}"><a href="#" onclick="Trading.app.getController(\'Game\').loadPage({page}); return false;" class="button {[(values.pressed) ? "pressed" : ""]}">{label}</a></li>', "</tpl>", "</ul>")
    },
    toggleFinancialViewChart: function() {
        if (!this.chartsRendered) {
            return
        }
        var a = this.selectedGameID;
        if ($("#chart-wrapper-" + a).css("display") === "block") {
            this.showFinancialViewCandleStickChart();
            this.selectedChartType = "candlestick";
            $("#financial-view-advanced-chart-icon").removeClass("candlestick").addClass("line")
        } else {
            this.showFinancialViewLineChart();
            this.selectedChartType = "line";
            $("#financial-view-advanced-chart-icon").removeClass("line").addClass("candlestick")
        }
        this.moveChartIndicator(a);
        this.colorBackground(a)
    },
    showFinancialViewLineChart: function() {
        var a = this.selectedGameID;
        $("#chart-wrapper-" + a).removeClass("chart-wrapper-hidden");
        $("#chart-wrapper-" + a).css("visibility", "visible");
        $("#chart-wrapper-" + a).show();
        $("#chart-candlestick-wrapper-" + a).addClass("chart-wrapper-hidden");
        $("#chart-candlestick-wrapper-" + a).css("visibility", "hidden");
        $("#chart-candlestick-wrapper-" + a).hide();
        if (Registry.userID) {
            $("#financial-view-social-icon").show()
        }
        Utils.setCookie(this.chartTypeCookieKey, "line", 365, "/")
    },
    showFinancialViewCandleStickChart: function() {
        var a = this.selectedGameID;
        $("#chart-wrapper-" + a).addClass("chart-wrapper-hidden");
        $("#chart-wrapper-" + a).css("visibility", "hidden");
        $("#chart-wrapper-" + a).hide();
        $("#chart-candlestick-wrapper-" + a).removeClass("chart-wrapper-hidden");
        $("#chart-candlestick-wrapper-" + a).css("visibility", "visible");
        $("#chart-candlestick-wrapper-" + a).show();
        if (Registry.userID) {
            $("#financial-view-social-icon").hide()
        }
        Utils.setCookie(this.chartTypeCookieKey, "candlestick", 365, "/")
    },
    zoomChart: function(a) {
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
    },
    formatOpensAt: function(a) {
        a = new Date(a);
        var d = Ext.Date.format(a, "Y-m-d");
        var b = Ext.Date.format(a, "H:i");
        var e = Registry._["closed-game-opens-at"] + " " + Ext.Date.format(a, "M d, H:i");
        var c = new Date(this.time);
        if (d == Ext.Date.format(c, "Y-m-d")) {
            e = Registry._["closed-game-opens-today-at"] + " " + b
        } else {
            c.setTime(c.getTime() + 86400000);
            if (d == Ext.Date.format(c, "Y-m-d")) {
                e = Registry._["closed-game-opens-tomorrow-at"] + " " + b
            }
        }
        return e
    },
    showAdvancedChart: function(a) {
        var d = "advanced-chart-window-" + a;
        var c = Ext.WindowMgr.get(d);
        if (Registry.mode == "no-charts") {
            return
        }
        if (!c) {
            var b = this.instruments.getById(a + "");
            c = Ext.create("Trading.view.AdvancedChart", {
                id: d,
                instrumentID: a,
                title: b.data.name,
                time: this.time
            })
        }
        c.show()
    },
    setReturnAmount: function(d, c, g) {
        var a = Ext.fly("investment-amount-" + d).dom.value;
        if (!a) {
            a = 0
        }
        var b = Ext.util.Format.number(a * (c + 100) / 100, "0,000.00");
        var f = Ext.util.Format.number(a * g / 100, "0,000.00");
        var e = this.formatPayout(c);
        Ext.fly("invoice-payout-" + d).dom.innerHTML = this.getUserCurrencyInfo().currencySymbol + b + " (" + e + ")";
        Ext.fly("invoice-rebate-" + d).dom.innerHTML = this.getUserCurrencyInfo().currencySymbol + f + " (" + g + "%)"
    },
    getGameType: function(b) {
        if (this.selectedGameTypes[b]) {
            Ext.getDom("game-" + b).setAttribute("data-game-type", this.selectedGameTypes[b]);
            if (Ext.select("#game-types-menu-" + b + " li.active").first()) {
                Ext.select("#game-types-menu-" + b + " li.active").first().removeCls("active");
                var a = this.selectedGameTypes[b];
                if (a == 11) {
                    a = 1
                }
                Ext.fly("game-type-" + b + "-" + a).addCls("active")
            }
        } else {
            this.selectedGameTypes[b] = Ext.getDom("game-" + b).getAttribute("data-game-type")
        }
        return Ext.getDom("game-" + b).getAttribute("data-game-type")
    },
    setGameType: function(c, a, b) {
        if (!b) {
            return
        }
        if (a != 3) {
            Ext.getDom("game-" + c).setAttribute("data-game-type", a);
            this.selectedGameTypes[c] = a + "";
            this.renderExpiryBoxes(c);
            this.renderIndicators(c, a, true)
        } else {
            if (!this.hasAdvancedGames(c)) {
                FinancialPanel.showDisabledMessage(c)
            } else {
                $(".trade-box-adv").show();
                FinancialPanel.init(c)
            }
        }
    },
    addTradeMarker: function(d, l) {
        var e = this;
        var h = e.charts[d];
        if (!h) {
            return
        }
        var b = "chart-series-" + d;
        var c = h.get(b);
        var k = Ext.get("game-" + d).dom;
        var g = Ext.fly("invoice-spot-" + d).dom.innerHTML * 1;
        var j = {
            x: e.time,
            y: g
        };
        var f = c.data.length;
        var a = {
            data: {
                index: f,
                instrumentID: d,
                tradeID: l,
                timestamp: j.x,
                direction: k.getAttribute("data-direction"),
                payout: k.getAttribute("data-payout"),
                rebate: k.getAttribute("data-rebate"),
                expiry: k.getAttribute("data-expiry"),
                stake: Ext.fly("investment-amount-" + d).getValue(),
                strike: g,
                expired: false
            }
        };
        c.data[c.data.length - 1].marker = {
            enabled: false
        };
        c.addPoint(j);
        e.moveChartIndicator(d);
        e.setTradeMarker(a);
        e.fixTradesMarkersPosition();
        e.setTradesMarkersVisibility(this.showTradesMarkers.myTrades);
        e.setTradesMarkersVisibility(this.showTradesMarkers.social, true, false)
    },
    updateTradeMarker: function(f, b, g) {
        var h = this.charts[f];
        var l = b.data.tradeID;
        var k;
        var d;
        var e;
        var a;
        var c = Ext.WindowMgr.get("advanced-chart-window-" + f);
        if (h && h.tradesMarkers) {
            k = h.tradesMarkers[l];
            if (k && k.marker) {
                b.data.social = (h.socialTrades && !Ext.isEmpty(h.socialTrades[l]));
                e = this.getTradeStatus(b);
                d = e.symbol;
                a = (e.payoff).toFixed(2);
                var j = Ext.getDom("trade-marker-symbol-" + l);
                if (j) {
                    j.setAttribute("href", d)
                } else {
                    console.log("could not find marker for ID: " + l)
                }
                if (c) {
                    c.updateTradeMarker(b)
                }
                k.tooltipData.returnedAmount = a;
                k.update(k, false);
                if (g || !j) {
                    k.marker.enabled = false;
                    delete h.tradesMarkers[l]
                }
            }
        }
    },
    updatePoint: function(f, c, j) {
        var g = this.charts[f];
        if (!g) {
            return
        }
        var d = g.get("chart-series-" + f);
        var e;
        var k;
        for (e = d.data.length - 1; e >= 0 && d.data[e].x > c; e--) {}
        k = d.data[e];
        k.x = c;
        k.y = j;
        k.update(k);
        var h = null;
        var b = Ext.WindowMgr.get("advanced-chart-window-" + f);
        if (b) {
            var a = b.lineChart;
            d = a.get("advanced-chart-line-series-" + f);
            for (e = d.data.length - 1; e >= 0 && d.data[e].x > c; e--) {}
            k = d.data[e];
            k.x = c;
            k.y = j;
            k.update(k);
            h = b.candlestickChart
        } else {
            h = this.candlestickCharts[f]
        }
        if (!h) {
            return
        }
        d = h.get("advanced-chart-candlestick-series-" + f);
        var k;
        for (e = d.data.length - 1; e >= 0 && d.data[e].x >= c; e--) {}
        k = d.data[e];
        k.close = j;
        if (j > k.high) {
            k.high = j
        }
        if (j < k.low) {
            k.low = j
        }
        d.data[e].update(k)
    },
    selectTradeMarker: function(c, f, b) {
        var d = this.charts[c];
        if (d && d.tradesMarkers) {
            var a = d.tradesMarkers[f];
            if (a && a.marker && this.showTradesMarkers.myTrades) {
                a.select(b, true);
                var e = Ext.WindowMgr.get("advanced-chart-window-" + c);
                if (e) {
                    e.selectTradeMarker(f, b)
                }
            }
        }
    },
    markSocialTrades: function(g, e, m) {
        var f = e.length - 1;
        var h = Trading.app.getController("Game");
        var b = Ext.WindowMgr.get("advanced-chart-window-" + g);
        var k = h.charts[g];
        var n;
        var d;
        var l;
        var j;
        var c;
        var a;
        if (!k.socialTrades) {
            k.socialTrades = {};
            k.lastSocialTradeID = 0
        }
        Ext.each(m,
        function(o) {
            a = {};
            if (o.data.instrumentID == g) {
                if (o.data.gameType == "7") {
                    return
                }
                n = o.data.tradeID * 1;
                d = Ext.isEmpty(k.socialTrades[n]);
                c = (e[0].x >= o.data.timestamp);
                j = ((!o.data.show) || c);
                if (j) {
                    if (!d) {
                        if (typeof(k.tradesMarkers[n]) != "undefined" && k.tradesMarkers[n].marker) {
                            k.tradesMarkers[n].marker.enabled = false
                        }
                        if (b) {
                            b.removeSocialEntry(o, c)
                        }
                        if (!c) {
                            delete k.socialTrades[n]
                        }
                    }
                } else {
                    if (d) {
                        if (n < k.lastSocialTradeID) {
                            return
                        }
                        for (f = e.length - 1; f >= 0; f--) {
                            if (o.data.timestamp > e[f].x) {
                                o.data.index = f;
                                o.data.social = true;
                                h.setTradeMarker(o);
                                if (b) {
                                    b.addSocialEntry(o)
                                }
                                k.socialTrades[n] = o;
                                a[(o.data.expired) ? Registry.socialActivityEventTypes.closePosition: Registry.socialActivityEventTypes.openPosition] = [o.data];
                                h.updateSocialActivityViewer(g, a);
                                k.lastSocialTradeID = n;
                                break
                            }
                        }
                    } else {
                        l = (!(k.socialTrades[n].data.expired) && o.data.expired);
                        if (l) {
                            h.updateTradeMarker(g, o, false);
                            if (b) {
                                b.updateSocialEntry(o)
                            }
                            k.socialTrades[n] = o;
                            a[Registry.socialActivityEventTypes.closePosition] = [o.data];
                            h.updateSocialActivityViewer(g, a)
                        }
                    }
                }
            }
        })
    },
    markTrades: function(b, d) {
        var c = d.length - 1;
        var a = Trading.app.getController("Game");
        Ext.each(Trading.app.getController("User").trades.data.items,
        function(e) {
            if (e.data.instrumentID == b && e.data.type < 3) {
                for (c = d.length - 1; c >= 0; c--) {
                    if (e.data.timestamp > d[c][0]) {
                        e.data.index = c;
                        a.setTradeMarker(e);
                        break
                    }
                }
            }
        })
    },
    setTradeMarker: function(c) {
        var b = this;
        var o = c.data;
        var u = o.instrumentID;
        var k = b.charts[u];
        var q = "chart-series-" + u;
        var h = k.get(q);
        var j = o.tradeID;
        var f = o.payout * 1;
        var s = o.rebate * 1;
        var t = o.direction * 1;
        var g = o.expiry * 1;
        var e = o.stake * 1;
        var a = o.strike * 1;
        var r = Registry.chartConfig.colors.marker;
        var p;
        var n;
        var d = false;
        var m;
        if (o.expired && (Ext.isEmpty(o.expiryPrice))) {
            return
        }
        m = this.getTradeStatus(c);
        p = m.symbol;
        if (c.data.social) {
            d = {
                userID: c.data.userID,
                nickname: c.data.nickname
            }
        }
        var l = {
            x: o.timestamp,
            y: a,
            marker: {
                enabled: true,
                fillColor: r,
                lineColor: Registry.chartConfig.colors.guide,
                symbol: "url(" + p + ")",
                lineWidth: 1,
                radius: 2,
                keep: true,
                states: {
                    hover: {
                        fillColor: r,
                        lineColor: Registry.chartConfig.colors.guide,
                        symbol: p
                    },
                    select: {
                        fillColor: r,
                        lineColor: Registry.chartConfig.colors.guide,
                        radius: 2,
                        symbol: p
                    }
                }
            },
            tooltipData: {
                tradeID: j,
                expiry: g,
                stake: e,
                direction: t,
                payout: f,
                rebate: s,
                social: d
            },
            events: {
                click: function() {
                    this.select(true);
                    return false
                },
                select: function() {
                    k.tooltip.refresh([this])
                },
                unselect: function() {
                    k.tooltip.hide()
                }
            },
            cursor: "pointer"
        };
        if (!k.tradesMarkers) {
            k.tradesMarkers = {}
        }
        if (o.expired && m.payoff !== null) {
            n = (m.payoff).toFixed(2);
            l.tooltipData.returnedAmount = n
        }
        h.data[o.index].update(l);
        k.tradesMarkers[j] = h.data[o.index];
        k.redraw();
        Ext.each(Ext.query("#chart-wrapper-" + u + " image"),
        function(v) {
            if (Ext.isEmpty(v.id)) {
                v.id = "trade-marker-symbol-" + j
            }
        });
        b.fixTradesMarkersPosition();
        b.setTradesMarkersVisibility(this.showTradesMarkers.myTrades);
        b.setTradesMarkersVisibility(this.showTradesMarkers.social, true, false)
    },
    fixTradesMarkersPosition: function(b) {
        var a = new Ext.util.DelayedTask(function() {
            var k = Trading.app.getController("Game");
            var d;
            var e;
            var f;
            var h = (b) ? "advanced-": "";
            var g;
            var j;
            var c;
            for (d in k.charts) {
                e = k.charts[d];
                if (e && e.tradesMarkers) {
                    for (f in e.tradesMarkers) {
                        g = Ext.getDom(h + "trade-marker-symbol-" + f);
                        if (g) {
                            j = e.tradesMarkers[f].tooltipData.social;
                            if (j) {
                                c = (b) ? "translate(-10,-27)": "translate(-7,-18)"
                            } else {
                                c = (b) ? "translate(-3,-14)": "translate(-3,-14)"
                            }
                            g.setAttribute("transform", c);
                            g.setAttribute("class", "pin")
                        }
                    }
                }
            }
        });
        a.delay(1000)
    },
    toggleTradesMarkers: function(c, d, b) {
        if (!d) {
            if (!b) {
                b = (c) ? !this.showTradesMarkers.social: !this.showTradesMarkers.myTrades
            }
            if (c) {
                this.showTradesMarkers.social = b
            } else {
                this.showTradesMarkers.myTrades = b
            }
        }
        this.setTradesMarkersVisibility(b, c, d);
        if (!c && !d) {
            this.setTradesMarkersVisibility(b, false, true)
        }
        var a = $("#financial-view-social-icon");
        if (a.length) {
            if ($("#show-social-trades-indicators-checkmark").attr("checked") === "checked") {
                a.addClass("active")
            } else {
                a.removeClass("active")
            }
        }
    },
    setTradesMarkersVisibility: function(c, b, n) {
        var g = this.charts;
        var k;
        var o;
        var f;
        var d;
        var a = (c) ? "visible": "hidden";
        var j = (n) ? "advanced-": "";
        var e;
        var m;
        var l;
        var h;
        for (f in g) {
            k = g[f];
            m = k.socialTrades;
            e = (b) ? k.socialTrades: k.tradesMarkers;
            if (e) {
                for (o in e) {
                    if (!b) {
                        l = false;
                        for (h in m) {
                            if (o == h) {
                                l = true;
                                break
                            }
                        }
                        if (l) {
                            continue
                        }
                    }
                    d = Ext.fly(j + "trade-marker-symbol-" + o);
                    if (d) {
                        d.setStyle("visibility", a)
                    }
                }
            }
        }
    },
    getTradeStatus: function(a, n) {
        var g = (n) ? Registry.chartConfig.advanced.markers: Registry.chartConfig.base.markers;
        var h = a.data.strike * 1;
        var m = a.data.expiryPrice * 1;
        var k = a.data.direction * 1;
        var b = a.data.stake * 1;
        var j = a.data.payout * 1;
        var o = a.data.rebate * 1;
        var l = a.data.expired;
        var p = h - m;
        var c;
        var f;
        var d;
        var e = true;
        if (!l) {
            c = (k == 1) ? g.trades.symbols.open.call: g.trades.symbols.open.put;
            f = null;
            d = "open";
            e = false
        } else {
            if (p * k < 0) {
                c = (k == 1) ? g.trades.symbols.inTheMoney.call: g.trades.symbols.inTheMoney.put;
                f = b + (b * j / 100);
                d = "in"
            } else {
                if (p * k > 0) {
                    c = (k == 1) ? g.trades.symbols.out.call: g.trades.symbols.out.put;
                    f = (b * o / 100);
                    d = "out"
                } else {
                    c = (k == 1) ? g.trades.symbols.at.call: g.trades.symbols.at.put;
                    f = b;
                    d = "at"
                }
            }
        }
        if (a.data.social) {
            c = (l) ? g.trades.symbols.close.social: g.trades.symbols.open.social
        }
        return {
            status: d,
            symbol: c,
            payoff: f,
            closed: e
        }
    },
    renderIndicators: function(c, a, b) {
        var e = {
            instrumentID: c,
            indicators: []
        };
        if (this.isGameSellBack(c, a)) {
            e.indicators.push({
                name: Registry._["trade-action-sell-back"],
                type: "sell-back-ind",
                title: Registry._["sell-back-indicator-title"]
            })
        }
        if (this.isGameRollOver(c)) {
            e.indicators.push({
                name: Registry._["roll-over"],
                type: "roll-over-ind",
                title: Registry._["roll-over-indicator-title"]
            })
        }
        if (this.isGameDoubleUp(c, a)) {
            e.indicators.push({
                name: Registry._.hedge,
                type: "hedge-ind",
                title: Registry._["hedge-indicator-title"]
            });
            e.indicators.push({
                name: Registry._["double-up"],
                type: "double-up-ind",
                title: Registry._["double-up-indicator-title"]
            })
        }
        var d = this.tplGameIndicators.apply(e);
        if (b) {
            Ext.fly("game-indicators-" + c).dom.innerHTML = d
        } else {
            return d
        }
    },
    getDefaultGameType: function(d) {
        var e = Trading.app.getController("Instrument");
        var c = e.instruments.getById(d);
        var b = this.isWeekendOptionEnabled(c);
        if (b) {
            return 7
        }
        if (Registry.shortGames.indexOf(d) == -1) {
            return 1
        } else {
            var a = e.instruments.getById(d).data.defaultGameType;
            if (a < 1 || a > 2) {
                a = 1
            }
            return a
        }
    },
    isGameSocial: function(a) {
        return (Registry.socialSite && (Registry.socialInstruments.indexOf(a) != -1))
    },
    isGameSellBack: function(b, a) {
        return ((a == 1 || a == 2) && (Registry.tradeOperationsConfig.sellbackInstruments.indexOf(b.toString()) != -1))
    },
    isGameDoubleUp: function(b, a) {
        if (typeof Registry.tradeOperationsConfig.doubleupInstruments !== "undefined") {
            return ((a == 1 || a == 2) && (Registry.tradeOperationsConfig.doubleupInstruments.indexOf(b.toString()) != -1))
        } else {
            return false
        }
    },
    isGameRollOver: function(a) {
        return false
    },
    getUserCurrencyInfo: function() {
        return Registry.currenciesInfo[Registry.userCurrency]
    },
    updateFormattedSpot: function(a) {
        var b = $("#game-" + a).attr("data-spot");
        if (!b) {
            return
        }
        b = this.formatSpot(a, b);
        $(".formatted-spot-" + a).html(b)
    },
    formatSpot: function(d, f) {
        f = this.getFixedQuote(d, f);
        var b = f.length - 3;
        var e = f.length - 2;
        if (f.charAt(b) === ".") {
            b++
        } else {
            if (f.charAt(e) === ".") {
                b--;
                e--
            }
        }
        var c = f.substring(b, e + 1);
        var a = f.substring(0, b) + '<span class="spot-large-digits">' + c + "</span>" + f.substring(e + 1, f.length - 1) + '<span class="spot-last-digit">' + f.charAt(f.length - 1) + "</span>";
        return a
    },
    getFixedQuote: function(c, b) {
        var a = this.instruments.getById(c).data.precision * 1;
        return new Number(b * 1).toFixed(a)
    }
});
Ext.define("Trading.model.Instrument", {
    extend: "Ext.data.Model",
    fields: [{
        name: "instrumentID",
        type: "string"
    },
    "name", "nameEnglish", "description", "expiry", "futureExpirationDate", "provider", "last", "isOpen", "opensAt", "closesAt", "type", "exchange", {
        name: "order",
        type: "int"
    },
    "payout", "rebate", "defaultGameType", "precision"],
    idProperty: "instrumentID",
    hasMany: [{
        model: "Trading.model.TradingHours",
        name: "tradingHours",
        associationKey: "tradingHours"
    },
    {
        model: "Trading.model.Payouts",
        name: "payouts",
        associationKey: "payouts"
    }],
    proxy: {
        type: "rest",
        url: "ajax/instrument/fetch-advanced",
        reader: {
            type: "json",
            root: "instruments"
        }
    },
    loadSubClasses: function(a) {
        this.payouts().removeAll();
        this.payouts().add(a.payouts);
        this.payouts().each(function(b) {
            if (b.data.payoutRanges) {
                if (b.data.gameType == 1) {
                    this.data.payout = b.data.payout;
                    this.data.rebate = b.data.rebate
                }
                b.payoutRanges().removeAll();
                b.payoutRanges().add(b.data.payoutRanges)
            }
        });
        this.tradingHours().removeAll();
        this.tradingHours().add(a.tradingHours);
        this.tradingHours().each(function(b) {
            if (b.data.tradingHourRanges) {
                b.tradingHourRanges().removeAll();
                b.tradingHourRanges().add(b.data.tradingHourRanges)
            }
        })
    }
});
Ext.define("Trading.controller.Instrument", {
    extend: "Ext.app.Controller",
    models: ["Instrument", "TradingHours", "TradingHourRanges", "Payouts", "PayoutRanges"],
    instruments: null,
    time: 0,
    loaded: false,
    lastPayouts: 0,
    lastTopPicks: 0,
    lastShortGames: 0,
    lastAssets: 0,
    init: function() {
        this.time = Registry.time;
        this.lastPayouts = Registry.time;
        this.instruments = Ext.create("Ext.data.Store", {
            model: "Trading.model.Instrument"
        });
        this.instruments.getProxy().url = "/" + Registry.currentLang + "/ajax/instrument/fetch-advanced";
        this.instruments.load({
            scope: this,
            callback: function() {
                this.loaded = true;
                this.updateUserPayouts();
                this.process();
                if (Registry.customIndexView) {
                    return
                }
                Trading.app.getController("Game").render();
                Trading.app.getController("User").renderTrades()
            }
        })
    },
    updateUserPayouts: function() {
        if (this.loaded) {
            this.instruments.each(function(b) {
                var a = 0;
                var c = 0;
                b.payouts().each(function(d) {
                    if (typeof Registry.payoutDeltas != "string" && Registry.payoutDeltas[d.data.gameType]) {
                        d.data.payout = d.data.payout * 1 + Registry.payoutDeltas[d.data.gameType];
                        d.payoutRanges().each(function(e) {
                            e.data.payout = e.data.payout * 1 + Registry.payoutDeltas[d.data.gameType]
                        })
                    }
                    if (d.data.gameType == 1) {
                        a = d.data.payout;
                        c = d.data.rebate
                    }
                });
                b.data.payout = a;
                b.data.rebate = c
            })
        }
    },
    process: function() {
        var a = this;
        if (this.loaded) {
            this.instruments.each(function(f) {
                var e = false;
                var c = 0;
                var b = 0;
                var h = (Registry.weekendGames.indexOf(f.data.instrumentID) != -1);
                f.tradingHours().each(function(j) {
                    if (j.data.gameType == 1 || (j.data.gameType == 7 && h)) {
                        j.tradingHourRanges().each(function(m) {
                            var l = a.time;
                            var o = m.data.from;
                            var n = m.data.to;
                            var k = false;
                            if (l < o && (c == 0 || o < c)) {
                                k = true
                            } else {
                                if (l >= o && l < n) {
                                    e = true;
                                    k = true
                                }
                            }
                            if (k) {
                                c = o;
                                b = n
                            }
                            return ! k
                        })
                    }
                });
                f.data.isOpen = e;
                f.data.opensAt = c;
                f.data.closesAt = b;
                var d = 0;
                var g = 0;
                f.payouts().each(function(j) {
                    if (j.data.gameType == 1) {
                        d = j.data.payout;
                        g = j.data.rebate
                    }
                });
                f.data.payout = d;
                f.data.rebate = g
            })
        }
    },
    setTime: function(b, a) {
        this.time = b;
        if (a) {
            this.process()
        }
    },
    update: function(j, h, g, c, d) {
        var f = 0;
        if (this.loaded) {
            var e = j.substr(4);
            j = this.instruments.getById(e);
            if (j) {
                if (j.data.last) {
                    var a = h * 1;
                    var b = j.data.last * 1;
                    if (a > b) {
                        f = 1
                    } else {
                        if (a < b) {
                            f = -1
                        }
                    }
                }
                FinancialPanel.quote(e, h, g, f, c, d);
                Trading.app.getController("Game").quote(e, h, g, f, c, d);
                Trading.app.getController("User").quote(e, h)
            }
        }
    },
    payouts: function(a) {
        if (a > this.lastPayouts) {
            this.lastPayouts = a;
            this.downloadPayouts(a)
        }
    },
    toppicks: function(a) {
        if (a > this.lastTopPicks) {
            this.lastTopPicks = a;
            this.downloadTopPicks(a)
        }
    },
    assets: function(a) {
        if (a > this.lastAssets) {
            this.lastAssets = a;
            this.downloadAssets(a)
        }
    },
    shortgames: function(a) {
        if (a > this.lastShortGames) {
            this.lastShortGames = a;
            this.downloadShortGames(a)
        }
    },
    updateGameData: function() {
        this.instruments.load({
            scope: this,
            callback: function() {
                this.process();
                Ext.Ajax.request({
                    url: Registry.uriBase + "/ajax/index/get-games-info",
                    success: function(a) {
                        a = Ext.decode(a.responseText);
                        Registry.shortGames = a.gamesInfo.shortGames;
                        Registry.featured = a.gamesInfo.featured;
                        Registry.tradeOperationsConfig = a.gamesInfo.tradeOperationsConfig;
                        var b = Trading.app.getController("Game");
                        if (b.currentFilter == "featured" || (Ext.isArray(b.currentFilter) && b.currentFilter[0].property == "featured")) {
                            b.render()
                        }
                    }
                })
            }
        })
    },
    downloadPayouts: function(d) {
        var c;
        var b;
        var e;
        var a = (Registry.env == "production") ? Registry.cdn + "/payouts/": Registry.cdnBase + "/tmp/";
        a += "new/" + Registry.alias + "/" + (d / 1000) + ".json";
        Ext.data.JsonP.request({
            url: a,
            callbackName: "payouts",
            scope: this,
            success: function(f) {
                for (b in f) {
                    e = f[b];
                    c = this.instruments.getById(b);
                    if (c) {
                        c.payouts().removeAll();
                        c.payouts().add(e);
                        c.payouts().each(function(g) {
                            if (g.data.payoutRanges) {
                                if (g.data.gameType == 1) {
                                    c.data.payout = g.data.payout;
                                    c.data.rebate = g.data.rebate
                                }
                                g.payoutRanges().removeAll();
                                g.payoutRanges().add(g.data.payoutRanges)
                            }
                        })
                    }
                }
                this.updateUserPayouts();
                if (Registry.customIndexView) {
                    if (typeof(FX1) != "undefined") {
                        FX1.updatePayout()
                    }
                }
                Trading.app.getController("Game").refreshPayouts()
            }
        })
    },
    downloadTopPicks: function(b) {
        var a = (Registry.env == "production") ? Registry.cdn + "/toppicks/": Registry.cdnBase + "/tmp/toppicks/";
        a += Registry.alias + "/" + b + ".json";
        $.getJSON(a,
        function(c) {
            Registry.featured = c;
            var d = Trading.app.getController("Game");
            if (d.currentFilter == "featured" || (Ext.isArray(d.currentFilter) && d.currentFilter[0].property == "featured")) {
                d.render()
            }
        })
    },
    downloadShortGames: function(b) {
        var a = (Registry.env == "production") ? Registry.cdn + "/shortgames/": Registry.cdnBase + "/tmp/shortgames/";
        a += Registry.alias + "/" + b + ".json";
        $.getJSON(a,
        function(c) {
            Registry.shortGames = c;
            var d = Trading.app.getController("Game");
            d.render()
        })
    },
    downloadAssets: function(c) {
        var b = (Registry.env == "production") ? Registry.cdn + "/assets_and_payouts/": Registry.cdnBase + "/tmp/assets_and_payouts/";
        b += Registry.alias + "/" + c + ".json";
        var a = this;
        $.getJSON(b,
        function(f) {
            var d;
            var e = [];
            var j = [];
            var n = (typeof a.instruments !== "undefined" && typeof a.instruments.data !== "undefined" && typeof a.instruments.data.items !== "undefined") ? a.instruments.data.items: [];
            for (d in n) {
                j[n[d].data.instrumentID] = n[d]
            }
            n = null;
            var m;
            var l = ["name", "nameEnglish", "description", "expiry", "type", "precision", "order", "defaultGameType", "provider", "futureExpirationDate"];
            for (d in f) {
                m = Ext.create("Trading.model.Instrument", f[d]);
                m.loadSubClasses(f[d]);
                m.raw = f[d];
                var h = m.data.instrumentID;
                var g;
                if (typeof j[h] !== "undefined") {
                    for (g in l) {
                        m.data[l[g]] = j[h].data[l[g]]
                    }
                    e.push(m)
                } else {}
            }
            a.instruments.loadData(e);
            a.updateUserPayouts();
            a.process();
            if (Registry.customIndexView) {
                return
            }
            var k = Trading.app.getController("Game");
            k.render()
        })
    }
});

Ext.application({
    name: "Trading",
    appFolder: "/app",
    controllers: [ "Game","Instrument"],
    launch: function() {
        Trading.app = this;

        //Trading.app.getController("Game").render();

        new Ext.util.DelayedTask(function() {
            location.reload(true)
        }).delay(1000 * 3600 * 6)
    }

});

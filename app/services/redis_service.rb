# this serivce is called by Rails application, use global variable $redis,
# this should be only way to connect redis in rails application
# try to fix too much redis client.

module RedisService

  def self.get_quote_by_time( symbol, time)
    key = ["Z", symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");
    hack_key = ["Z", 'hquote', symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");

    score_from = time.to_i*1000
    score_to = time.advance( seconds: 10 ).to_i * 1000
Rails.logger.debug "key=#{key}, hack_key=#{hack_key}, score_from=#{score_from} score_to=#{score_to}"
    closest_quote = $redis.zrangebyscore( key, score_from, score_to ).first
    hack_closest_quote = $redis.zrangebyscore( hack_key, score_from, score_to ).first

    quote = 0, hack_quote = 0
    if hack_closest_quote
      hack_quote = hack_closest_quote.split('_').second.to_f
    end
    if closest_quote
      quote = closest_quote.split('_').second.to_f
    end

    return quote, hack_quote

  end

  # compare instrument current price with old price,  ex. in 10mins, it raise or down
  # period: in second,  ex. 10*60  10min
  # ex, RedisService.get_trend_in_period(['EURCHF','EURJPY'],600)

  def self.get_trend_in_period( symbols, period )
    now = DateTime.current
    period_ago = DateTime.current.ago( period )

    prices = $redis.multi do
      # get prices before 10 mins
      symbols.each{|symbol|
        key = ["Z", symbol, now.beginning_of_day.ago( 3600*24 * now.wday ).to_i * 1000].join("_")
        #ZRANGE key start stop
        $redis.zrange( key, -1, -1)
        $redis.zrangebyscore( key, period_ago.ago( 5 ).to_i * 1000, period_ago.to_i*1000 )
      }
    end
    #[["1484054729553_1.07340_1484054727"],
    #["1484054125671_1.07356_1484054123",
    # "1484054126675_1.07356_1484054123",
    # "1484054127672_1.07356_1484054123",
    # "1484054128676_1.07356_1484054123",
    # "1484054129679_1.07356_1484054123"],
    #["1484054729553_122.803_1484054727"],
    #["1484054125671_122.861_1484054123",
    # "1484054126675_122.858_1484054125",
    # "1484054127672_122.859_1484054126",
    # "1484054128676_122.861_1484054126",
    # "1484054129679_122.858_1484054128"]]

    trends = []
    symbols.each_with_index{| symbol, i|

      current_raw_price = prices[i*2].last
      period_before_raw_price = prices[i*2+1].last

      current_price =  current_raw_price.present? ? current_raw_price.split('_')[1].to_f : 0
      before_price = period_before_raw_price.present? ? period_before_raw_price.split('_')[1].to_f : 0
      trends[i] = ( before_price == current_price ? 0 : ( before_price < current_price ? 1 : -1) )
    }
    trends
  end

end

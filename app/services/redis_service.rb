# this serivce is called by Rails application, use global variable $redis,
# this should be only way to connect redis in rails application
# try to fix too much redis client.

module RedisService

  def self.get_quote_by_time( symbol, time)
      key = ["Z", symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_")
      closest_quote = $redis.zrangebyscore( key, time.ago( 15 ).to_i * 1000, time.to_i*1000 ).last
      closest_quote.present? ? closest_quote.split('_').second : 0
  end

end

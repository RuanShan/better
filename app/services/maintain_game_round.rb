require "redis"

class MaintainGameRound
  attr_accessor :specified_time, :redis

  def initialize( specified_time = nil)
    self.redis = Redis.new()
    self.specified_time = specified_time || DateTime.current.beginning_of_minute
  end

  def run
    pending_game_rounds = GameRound.with_state(:pending).where( ["end_at<=?", specified_time] )

    close_pending_game(pending_game_rounds )

    create_missing_game_rounds( pending_game_rounds )

    redis.quit
  end


  def close_pending_game(pending_game_rounds )
    pending_game_rounds.each{|pgr|
      pgr.complete!
    }
  end

  def create_missing_game_rounds( existing_game_rounds )
    # game closed in every 5min
    if specified_time.minute % 5 == 0
      period = 300
      start_at = self.specified_time.ago( period )
      end_at = self.specified_time
      GameInstrument.all.pluck(:code).each{|symbol|
        #found = GameRound.exists?{ symbol: symbol, end_at: end_at,  period: period }
        unless GameRound.exists?( instrument_code: symbol, end_at: end_at,  period: period )
          quote = get_quote_by_time( symbol, end_at)
          attrs = {instrument_quote: quote || 0, instrument_code: symbol, start_at: start_at,  period: period, end_at: end_at }
          GameRound.create!( attrs ).complete
        end
      }
    end
  end


  def get_quote_by_time( symbol, time)

    key = ["Z", symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");

    closest_quote = self.redis.zrangebyscore( key, time.to_i*1000, time.advance( seconds: 10 ).to_i * 1000 ).first
#Rails.logger.debug " closest_quote=#{closest_quote.inspect}"
    closest_quote.split('_').second  if closest_quote
  end


end

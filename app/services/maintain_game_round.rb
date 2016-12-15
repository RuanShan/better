require "redis"

class MaintainGameRound
  attr_accessor :specified_time, :redis

  def initialize( specified_time = nil)
    self.redis = Redis.new

    self.specified_time = specified_time || DateTime.current.beginning_of_minute
  end

  def run
    Rails.logger.debug "start run"
    pending_game_rounds = GameRound.with_state(:pending).where( ["end_at<=?", specified_time] )

    Rails.logger.debug "before close"
    close_pending_game(pending_game_rounds )

    Rails.logger.debug "before create"
    create_missing_game_rounds( pending_game_rounds )
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
      Forex.symbols.each{|symbol|
        found = existing_game_rounds.index{|gr| gr.symbol == symbol && gr.end_at == end_at && gr.period == period }
        unless found
          quote = get_quote_by_time( symbol, time)
          attrs = {instrument_quote: quote || 0, instrument_code: symbol, start_at: start_at,  period: period, end_at: end_at }
          GameRound.create!( attrs )
        end
      }
    end
  end


  def get_quote_by_time( symbol, time)

    var key = ["Z", symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");


    closest_quote = redis.zrangebyscore( key, time.to_i*1000, time.advance( seconds: 5 ).to_i * 1000 ).first

  end


end

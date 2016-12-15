require "redis"

class MaintainGameRoundEveryMinute
  attr_accessor :specified_time, :redis

  def initialize( specified_time = nil)
    self.redis = Redis.new

    self.specified_time = specified_time.beginning_of_minute || DateTime.current.beginning_of_minute
  end

  def run
    pending_game_rounds = GameRound.pending.where( ["end_at<=?", specified_time] )

    close_pending_game(pending_game_rounds )


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
        found = existing_game_rounds.find
        unless found
          attrs = {instrument_quote: , instrument_code: symbol, start_at: start_at,  period: period, end_at: end_at }
          GameRound.create!( attrs )
        end
      }
    end
  end


  def get_quote_by_time( symbol, time)
    

  end
end

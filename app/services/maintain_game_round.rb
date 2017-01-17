require "redis"

class MaintainGameRound
  attr_accessor :specified_time, :redis

  def initialize( specified_time = nil)
    self.specified_time = specified_time || DateTime.current.beginning_of_minute
  end

  def run
    # initialize redis in this method, and free at the end.
    self.redis = Redis.new()
Rails.logger.debug "MaintainGameRound at=#{ DateTime.current} "
    # handle started game round
    start_up_game_rounds

    # complete pending game
    started_game_rounds = GameRound.with_state(:started).where( ["end_at<=?", specified_time] )

    close_started_game(started_game_rounds )

    create_missing_game_rounds( started_game_rounds )

    redis.quit
  end

  def start_up_game_rounds
    hmkey = build_hmkey( specified_time )
    #Thu, 12 Jan 2017 20:53:30 CST +08:00 -- Thu, 12 Jan 2017 20:54:00 CST +08:00, 没有处理只有半分钟的情况
    started_game_rounds = GameRound.with_state(:pending).where( ["start_at<=? and end_at>=?", specified_time, specified_time] )
    expected_quote_hash = {}
    started_game_rounds.each{| game_round |
      #expected_quote, highlow = game_round.get_platform_expected_quote
      #if expected_quote != 0
      #  # hmset  name:hm_week_start_at  key: symbol_end_at  val: expected_quote_highlow
      #  val = [expected_quote, highlow].join('_')
      #  expected_quote_hash.store build_expected_quote_key( game_round ), val
      #end
      if game_round.hack_win?
        expected_quote_hash.merge! game_round.expected_quote_hash
      end
      game_round.start_up
    }
    #puts " expected_quote_hash =#{expected_quote_hash }"

    if expected_quote_hash.present?
      # expire at next Monday midnight
      expire_at = specified_time.advance( days: (8- specified_time.wday)).end_of_day.to_i*1000
      #puts "redis store =#{hmkey} #{expected_quote_hash.inspect}"
      redis.multi do
        redis.hmset hmkey, *expected_quote_hash.to_a
        redis.pexpireat hmkey, expire_at
      end
    end
  end


  def close_started_game( pending_game_rounds )
    pending_game_rounds.each{|pgr|
      quote, hack_quote = get_quote_by_time( self.redis, pgr.instrument_code, pgr.end_at)
      pgr.instrument_quote = quote
      if pgr.hack_win?
        # since hack_quote may not same as :get_platform_expected_quote  due to time mismatches
        hack_quote = pgr.get_platform_expected_quote
        pgr.instrument_hack_quote = hack_quote
      end
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
          quote, hack = get_quote_by_time(self.redis, symbol, end_at)
          attrs = {instrument_quote: quote || 0, instrument_code: symbol, start_at: start_at,  period: period, end_at: end_at }
          GameRound.create!( attrs ).complete
        end
      }
    end
  end


  def get_quote_by_time( redis_client, symbol, time)
    #time is game_round.end_at
    key = ["Z", symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");
    hack_key = ["Z", 'hquote', symbol, time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");
    score_from = time.to_i*1000
    score_to = time.advance( seconds: 10 ).to_i * 1000
Rails.logger.debug "key=#{key}, hack_key=#{hack_key}, score_from=#{score_from} score_to=#{score_to}"
    closest_quote = redis_client.zrangebyscore( key, score_from, score_to ).first
    hack_closest_quote = redis_client.zrangebyscore( hack_key, score_from, score_to ).first
Rails.logger.debug " closest_quote=#{closest_quote.inspect}, hack_closest_quote=#{hack_closest_quote}"

    quote = 0, hack_quote = 0
    if hack_closest_quote
      hack_quote = hack_closest_quote.split('_').second.to_f
    end
    if closest_quote
      quote = closest_quote.split('_').second.to_f
    end

    return quote, hack_quote
  end

  #expected quote key
  def build_hmkey( time )
    key = ["HM","hquote", time.beginning_of_day.ago( 3600*24 * time.wday ).to_i * 1000].join("_");

  end

  #symbol_end_at_highlow_period
  def build_expected_quote_key( game_round )
    key = [ game_round.instrument_code, game_round.end_at.to_i ].join('_')
  end

end

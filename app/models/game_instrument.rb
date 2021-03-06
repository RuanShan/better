class GameInstrument < ApplicationRecord
  #self.per_page = 4

  has_one :last_game_round, ->{ last_round }, primary_key: :code, foreign_key: :instrument_code, class_name: 'GameRound'

  enum category_id: { currency: 0, index: 1, stock: 2, product: 3, xxx: 4 }

  scope :hot, ->{ where hot: true }

  def display_rate
    rates = rate.split(",")
    rates.empty? ? "0%" : (rates.size == 1 ? rates.first+"%" : get_time_rate+"%")
  end

  def get_time_rate
    "70"
  end

  def display_default_rate
    "%i%" % (default_rate*100)
  end

  def is_price_enabled?( amount, game_round )
    max_price = get_max_price( game_round )
    max_price == 0 || amount <= max_price
  end

  def get_max_price( game_round )
    game_id = game_round.game_id
    period = game_round.period

    if game_id == 1 && period == 300
      period5m_max_price
    else
      case period
        when 30
          period30s_max_price
        when 60
          period60s_max_price
        when 120
          period120s_max_price
        when 300
          period300s_max_price
        else
          0
      end
    end
  end

  def is_period_enabled?(game_round )
    game_id = game_round.game_id
    period = game_round.period

    if game_id == 1 && period == 300
      period5m_enabled == 1
    else
      case period
        when 30
          period30s_enabled == 1
        when 60
          period60s_enabled == 1
        when 120
          period120s_enabled == 1
        when 300
          period300s_enabled == 1
        else
          false
      end
    end
  end

  def is_open_at?( time = DateTime.current )
    wday = time.wday

    open_close = get_business_time_by_wday( wday )
    halftime_open_close = get_halftime_by_wday( wday )

    is_open = (open_close[0].to_s(:time)<= time.to_s(:time) && open_close[1].to_s(:time)>= time.to_s(:time))

    return is_open unless is_open

    return is_open if halftime_open_close[0] == halftime_open_close[1]

    return halftime_open_close[0].to_s(:time) > time.to_s(:time) || halftime_open_close[1].to_s(:time) < time.to_s(:time)
  end

  def available_at
    open_at = DateTime.current

    return open_at if is_open_at?( open_at )

    time = nil
    wday = open_at.wday

    open_close = get_business_time_by_wday( wday )
    halftime_open_close = get_halftime_by_wday( wday )

    # check start time of today
    time = open_close[0] if open_close[0].to_s(:time) > open_at.to_s(:time)
    # check halftime
    if time.nil?
      if halftime_open_close[0] != halftime_open_close[1]
        time = halftime_open_close[1] if halftime_open_close[1].to_s(:time) > open_at.to_s(:time)
      end
    end
    # get start time in next days
    if time.nil?
      ((wday+1)..6).each{|i|
        open_at =open_at.advance( days: 1 )
        open_close = get_business_time_by_wday( i )
        if open_close[0] != open_close[1]
          time = open_close[0]
          break
        end
      }
    end
    puts "1open_at=#{open_at}, time=#{time}"

    if time.nil?
      (0...( wday)).each{|i|
        open_at = open_at.advance( days: 1 )
        open_close = get_business_time_by_wday( i )
        if open_close[0] != open_close[1]
          time = open_close[0]
          break
        end
      }
    end
    puts "2open_at=#{open_at}, time=#{time}"

    if time.present?
      open_at=DateTime.civil_from_format( :local, open_at.year, open_at.month, open_at.day, time.hour, time.min )
    end
    open_at
  end

  def get_halftime_by_wday( wday )
    open_close = case wday
      when 1
        [ day1_halftime_start_at, day1_halftime_end_at ]
      when 2
        [ day2_halftime_start_at, day2_halftime_end_at ]
      when 3
        [ day3_halftime_start_at, day3_halftime_end_at ]
      when 4
        [ day4_halftime_start_at, day4_halftime_end_at ]
      when 5
        [ day5_halftime_start_at, day5_halftime_end_at ]
      when 6
        [ day6_halftime_start_at, day6_halftime_end_at ]
      when 0
        [ day7_halftime_start_at, day7_halftime_end_at ]
    end

    open_close[0] = DateTime.current.beginning_of_day if open_close[0].nil?
    open_close[1] = DateTime.current.beginning_of_day if open_close[1].nil?

    open_close
  end

  def get_business_time_by_wday( wday )
    open_close = case wday
      when 1
        [ day1_open_at, day1_close_at ]
      when 2
        [ day2_open_at, day2_close_at ]
      when 3
        [ day3_open_at, day3_close_at ]
      when 4
        [ day4_open_at, day4_close_at ]
      when 5
        [ day5_open_at, day5_close_at ]
      when 6
        [ day6_open_at, day6_close_at ]
      when 0
        [ day7_open_at, day7_close_at ]
    end

    open_close[0] = DateTime.current.beginning_of_day if open_close[0].nil?
    open_close[1] = DateTime.current.end_of_day if open_close[1].nil?
    open_close
  end


end

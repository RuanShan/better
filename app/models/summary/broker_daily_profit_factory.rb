module Summary
  class BrokerDailyProfitFactory
    # user_days 可能会有多个日期，需要分组
    def self.create( user_days )
      grouped_user_days = {}

      user_days.each{|day|
        grouped_user_days[day.effective_on] ||= []
        grouped_user_days[day.effective_on] << day
      }
      daily_profits = grouped_user_days.map{|date,days|
        BrokerDailyProfit.new( date, days)
      }
      daily_profits.sort { |x,y| y.effective_on <=> x.effective_on }
    end
  end
end

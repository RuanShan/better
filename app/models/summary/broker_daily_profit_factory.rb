module Summary
  #代理日盈利表，按日期分组
  class BrokerDailyProfitFactory
    # member_days 可能会有多个日期，需要分组
    def self.create( member_days )
      grouped_member_days = {}

      member_days.each{|day|
        grouped_member_days[day.effective_on] ||= []
        grouped_member_days[day.effective_on] << day
      }
      daily_profits = grouped_member_days.map{|date, days|
        BrokerDailyProfit.new( date, days)
      }
      daily_profits.sort { |x,y| y.effective_on <=> x.effective_on }
    end
  end
end

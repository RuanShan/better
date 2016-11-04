module Summary
  #会员明细表
  class BrokerMemberProfitFactory
    # 取得用户生命周期的数据
    # 取得特定时间区间内的数据
    def self.create( users, from_date = nil, to_date = DateTime.current.to_date )
      # user ( user_today, user_life )
      if from_date.present?
        handle_period_profit( users, from_date,  to_date )
      else
        handle_life_profit( users )
      end
    end

    def self.handle_period_profit( users, from_date,  to_date )
      user_ids = users.pluck(:id)
      user_days = UserDay.between_dates( from_date, to_date ).where( user_id: user_ids )
      users.map{|user|
        MemberPeriodProfit.new( user, user_days.select{|day| day.user_id == user.id } )
      }

    end

    def self.handle_life_profit( users )
      users.map{|user|
        MemberProfit.new( user )
      }
    end

  end
end

module Summary
  #会员明细表
  #特定时间区间内的数据, 如：2015-6-11 ~ 2015-9-2
  class MemberPeriodProfit < ProfitBase
    attr_accessor :user, :user_days, :from_date, :to_date

    def initialize( user, user_days, from_date, to_date )
      super()
      self.user = user
      self.user_days = user_days
      self.from_date = from_date
      self.to_date = to_date
      initialize_attributes
    end


    def initialize_attributes

      user_days.each{|day|
        self.deposit_amount += day.deposit_amount
        self.drawing_amount += day.drawing_amount
        self.bid_amount += day.bid_amount
        self.bonus += day.bonus
        self.profit += day.profit
        self.deposit_member_count += 1 if day.deposit_amount>0
        self.drawing_member_count += 1 if day.drawing_amount>0
      }
      #取得最后一天的 balance
      last_day = user_days.sort { |x,y| y.effective_on <=> x.effective_on }.last
      last_day ||= user.user_days.before_date(from_date).order( effective_on: :desc ).first

      self.balance = last_day.balance if last_day

      self.net = drawing_amount + balance - deposit_amount

    end


  end
end

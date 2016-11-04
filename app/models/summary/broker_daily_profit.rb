module Summary
  class BrokerDailyProfit
    attr_accessor :user_days, :effective_on
    attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit
    attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
    #活跃人数	存款(人数)	提款(人数)	投注	输赢	红利	盈利

    def initialize( effective_on, user_days =[] )
      self.effective_on = effective_on
      self.user_days = user_days
      initialize_attributes
    end

    def initialize_attributes
      self.balance, self.bonus, self.profit = 0, 0, 0
      self.deposit_amount , self.drawing_amount , self.bid_amount  = 0, 0 ,0
      self.deposit_member_count , self.drawing_member_count = 0 , 0
      user_days.each{|day|
        self.deposit_amount += day.deposit_amount
        self.drawing_amount += day.drawing_amount
        self.bid_amount += day.bid_amount
        self.bonus += day.bonus
        self.deposit_member_count += 1 if day.deposit_amount>0
        self.drawing_member_count += 1 if day.drawing_amount>0
      }
    end
  end
end

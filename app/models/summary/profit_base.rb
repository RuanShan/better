module Summary
  class ProfitBase
    extend DisplayMoney
    money_methods :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :net

    attr_accessor :from_date, :to_date
    #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
    attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit
    attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
    attr_accessor :net #输赢 = 提款+账户余额-存款

    def initialize
      self.balance, self.bonus, self.profit, self.net = 0, 0, 0, 0
      self.deposit_amount , self.drawing_amount , self.bid_amount  = 0, 0 ,0
      self.deposit_member_count , self.drawing_member_count = 0 , 0
    end
  end
end

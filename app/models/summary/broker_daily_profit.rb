module Summary
  #
  class BrokerDailyProfit
    attr_accessor :user_days, :effective_on
    #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
    attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit
    attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
    attr_accessor :net #输赢 = 提款+账户余额-存款

    def initialize( effective_on, user_days =[] )
      self.effective_on = effective_on
      self.user_days = user_days

      self.balance, self.bonus, self.profit, self.net = 0, 0, 0, 0
      self.deposit_amount , self.drawing_amount , self.bid_amount  = 0, 0 ,0
      self.deposit_member_count , self.drawing_member_count = 0 , 0

      initialize_attributes
    end

    def initialize_attributes
      user_days.each{|day|
        self.deposit_amount += day.deposit_amount
        self.drawing_amount += day.drawing_amount
        self.bid_amount += day.bid_amount
        self.balance += day.balance
        self.bonus += day.bonus
        self.profit += day.profit
        self.deposit_member_count += 1 if day.deposit_amount>0
        self.drawing_member_count += 1 if day.drawing_amount>0
      }
      self.net = drawing_amount + balance - deposit_amount
    end

    def self.generate_csv(daily_profits, options = {})
      CSV.generate(options) do |csv|
        csv << ["日期", "活跃人数", "存款(人数)", "提款(人数)", "投注", "输赢", "红利", "盈利"]
        daily_profits.each do |daily_profit|
          csv << [daily_profit.effective_on, 0, daily_profit.deposit_amount.to_s+"(#{daily_profit.deposit_member_count})",
            daily_profit.drawing_amount.to_s+"(#{daily_profit.drawing_member_count})", daily_profit.bid_amount,
            daily_profit.net,daily_profit.bonus, daily_profit.profit]
        end
      end
    end

  end
end

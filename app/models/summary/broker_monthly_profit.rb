module Summary
  #
  class BrokerMonthlyProfit
    extend DisplayMoney
    money_methods :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :bid_difference, :net, :net_difference

    attr_accessor :user_months, :effective_on
    #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
    attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :bid_difference
    attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
    attr_accessor :net, :net_difference #输赢 = 提款+账户余额-存款

    def initialize( effective_on, user_months =[] )
      self.effective_on = effective_on
      self.user_months = user_months

      self.balance, self.bonus, self.profit, self.net = 0, 0, 0, 0
      self.deposit_amount , self.drawing_amount , self.bid_amount  = 0, 0, 0
      self.deposit_member_count , self.drawing_member_count = 0 , 0
      self.bid_difference , self.net_difference = 0, 0

      initialize_attributes
    end

    def initialize_attributes
      user_months.each{|month|
        self.deposit_amount += month.deposit_amount
        self.drawing_amount += month.drawing_amount
        self.bid_amount += month.bid_amount
        self.bid_difference += month.bid_difference
        self.net_difference += month.net_difference
        self.balance += month.balance
        self.bonus += month.bonus
        self.profit += month.profit
        self.deposit_member_count += 1 if month.deposit_amount>0
        self.drawing_member_count += 1 if month.drawing_amount>0
      }
      self.net = drawing_amount + balance - deposit_amount
    end

    def self.generate_csv(monthly_profits, options = {})
      CSV.generate(options) do |csv|
        csv << ["月份", "活跃人数", "存款(人数)", "提款(人数)", "投注", "投注补差", "输赢", "输赢补差", "红利", "盈利"]
        monthly_profits.each do |monthly_profit|
          csv << [monthly_profit.effective_on.to_s(:year_month), 0, monthly_profit.deposit_amount.to_s+"(#{monthly_profit.deposit_member_count})",
            monthly_profit.drawing_amount.to_s+"(#{monthly_profit.drawing_member_count})", monthly_profit.bid_amount, monthly_profit.bid_difference,
            monthly_profit.net, monthly_profit.net_difference, monthly_profit.bonus, monthly_profit.profit]
        end
      end
    end

  end
end

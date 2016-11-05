module Summary
  #
  class BrokerMonthlyBalance
    attr_accessor :user_months, :effective_on
    attr_accessor :profit, :bid_amount
    attr_accessor :bank_charges, :platform_charges, :net_profit
    attr_accessor :last_month_negative_balance, :this_month_balance

    def initialize( effective_on, user_months =[] )
      self.effective_on = effective_on
      self.user_months = user_months

      self.profit , self.bid_amount = 0, 0
      self.bank_charges , self.platform_charges , self.net_profit = 0, 0, 0
      self.last_month_negative_balance , self.this_month_balance = 0, 0

      initialize_attributes
    end

    def initialize_attributes
      user_months.each{|month|
        self.bid_amount += month.bid_amount
        self.profit += month.profit
        self.bank_charges += month.bank_charges
        self.platform_charges += month.platform_charges
      }
      self.net_profit = profit - bank_charges - platform_charges
      self.this_month_balance = profit + bid_amount
    end

    def self.generate_csv(monthly_balances, options = {})
      CSV.generate(options) do |csv|
        csv << ["月份/日期", "活跃人数", "盈利", "银行手续费", "平台手续费", "净盈利", "上月负结余", "本月结余"]
        monthly_balances.each do |monthly_balance|
          csv << [monthly_balance.effective_on.to_s(:year_month), 0, monthly_balance.profit, monthly_balance.bank_charges,
            monthly_balance.platform_charges, monthly_balance.net_profit, monthly_balance.last_month_negative_balance,
            monthly_balance.this_month_balance]
        end
      end
    end

  end
end

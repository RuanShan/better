module Summary
  module Children
    class SaleMonthBalance < SaleBase
      extend DisplayMoney
      money_methods :profit, :bid_amount, :bank_charges, :platform_charges, :net_profit, :last_month_negative_balance, :this_month_balance

      attr_accessor :user_months

      attr_accessor :profit, :bid_amount, :energetic_member_count
      attr_accessor :bank_charges, :platform_charges, :net_profit
      attr_accessor :last_month_negative_balance, :this_month_balance


      def initialize( children_broker, user_months =[] )
        super(children_broker)
        monthly_balance  = SaleMonthlyBalance.new( nil, user_months)
        attrs = [:profit, :bid_amount, :energetic_member_count, :bank_charges, :platform_charges, :net_profit, :last_month_negative_balance, :this_month_balance]
        attrs.each{|attr|self.send("#{attr.to_s}=", monthly_balance.send("#{attr.to_s}"))}
      end

      def self.generate_csv(month_balances, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "活跃人数", "盈利", "银行手续费", "平台手续费", "净盈利", "上月负结余", "本月结余"]
          month_balances.each do |month_balance|
            csv << [month_balance.seller_name, month_balance.sign_up_time, month_balance.state, month_balance.energetic_member_count, month_balance.profit,
              month_balance.bank_charges, month_balance.platform_charges, month_balance.net_profit,
              month_balance.last_month_negative_balance, month_balance.this_month_balance]
          end
        end
      end

    end
  end
end

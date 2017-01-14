module Summary
  module Children
    class SaleMonthProfit < SaleBase
      extend DisplayMoney
      money_methods :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :bid_difference, :net, :net_difference

      attr_accessor :user_months
      #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
      attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :bid_difference
      attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
      attr_accessor :net, :net_difference#输赢 = 提款+账户余额-存款

      def initialize( children_broker, user_months =[] )
        super(children_broker)
        monthly_profit  = SaleMonthlyProfit.new( nil, user_months)
        attrs = [:deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :deposit_member_count, :drawing_member_count, :energetic_member_count, :net, :bid_difference, :net_difference ]
        attrs.each{|attr|self.send("#{attr.to_s}=", monthly_profit.send("#{attr.to_s}"))}
      end

      def self.generate_csv(month_profits, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "活跃人数", "存款(人数)", "提款(人数)", "投注", "输赢", "红利", "盈利"]
          month_profits.each do |month_profit|
            csv << [month_profit.seller_name, month_profit.sign_up_time, month_profit.state, month_profit.energetic_member_count,
              month_profit.deposit_amount.to_s+"(#{month_profit.deposit_member_count})",
              month_profit.drawing_amount.to_s+"(#{month_profit.drawing_member_count})", month_profit.bid_amount,
              month_profit.net, month_profit.bonus, month_profit.profit]
          end
        end
      end

    end
  end
end

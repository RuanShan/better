module Summary
  module Children
    class BrokerMonthProfit < ChildrenBase
      attr_accessor :user_months
      #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
      attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit
      attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
      attr_accessor :net #输赢 = 提款+账户余额-存款

      def initialize( children_broker, user_months =[] )
        super(children_broker)
        monthly_profit  = BrokerMonthlyProfit.new( nil, user_months)
        logger.debug "self.attributes=#{self.attributes.inspect}"
        self.attributes = monthly_profit.attributes
      end

      def self.generate_csv(month_profits, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "活跃人数", "存款(人数)", "提款(人数)", "投注", "输赢", "红利", "盈利"]
          month_profits.each do |month_profit|
            csv << [month_profit.broker_name, month_profit.sign_up_time, month_profit.state, 0,
              month_profit.deposit_amount.to_s+"(#{month_profit.deposit_member_count})",
              month_profit.drawing_amount.to_s+"(#{month_profit.drawing_member_count})", month_profit.bid_amount,
              month_profit.net, month_profit.bonus, month_profit.profit]
          end
        end
      end

    end
  end
end

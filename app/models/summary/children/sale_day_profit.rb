module Summary
  module Children
    class SaleDayProfit < ChildrenBase
      extend DisplayMoney
      money_methods :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :net

      attr_accessor :user_days
      #活跃人数	        存款(人数)	     提款(人数)	       投注	       账户余额    红利	    盈利
      attr_accessor :deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit
      attr_accessor :deposit_member_count, :drawing_member_count, :energetic_member_count
      attr_accessor :net #输赢 = 提款+账户余额-存款

      def initialize( children_broker, user_days =[] )
        super(children_broker)
        daily_profit  = BrokerDailyProfit.new( nil, user_days)
        attrs = [:deposit_amount, :drawing_amount, :bid_amount, :balance, :bonus, :profit, :deposit_member_count, :drawing_member_count, :energetic_member_count, :net ]
        attrs.each{|attr|self.send("#{attr.to_s}=", daily_profit.send("#{attr.to_s}"))}
      end

      def self.generate_csv(day_profits, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "活跃人数", "存款(人数)", "提款(人数)", "投注", "输赢", "红利", "盈利"]
          Rails.logger.debug "day_profits=#{day_profits.inspect}"
          day_profits.each do |day_profit|
            csv << [day_profit.broker_name, day_profit.sign_up_time, day_profit.state, 0, day_profit.deposit_amount.to_s+"(#{day_profit.deposit_member_count})",
              day_profit.drawing_amount.to_s+"(#{day_profit.drawing_member_count})", day_profit.bid_amount,
              day_profit.net, day_profit.bonus, day_profit.profit]
          end
        end
      end

    end
  end
end

module Summary
  module Children

    class BrokerMonth < ChildrenBase
      attr_accessor :broker_months
            	    # 推广链接点击数	  注册数	         新注册并存款              注册存款转化率
      attr_accessor :clink_visits, :member_count, :valuable_member_count, :valuable_rate

      def initialize( children_broker, broker_months=[] )
        super(children_broker)
        self.broker_months = broker_months

        self.clink_visits, self.member_count = 0, 0
        self.valuable_member_count , self.valuable_rate = 0, 0

        initialize_attributes
      end

      def initialize_attributes
        broker_months.each{|month|
          self.clink_visits += month.clink_visits
          self.member_count += month.member_count
          self.valuable_member_count += month.valuable_member_count
        }
        self.valuable_rate = valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
      end

      def display_valuable_rate
        "%i%" % (valuable_rate*100)
      end

      def self.generate_csv(broker_months, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "推广链接点击数", "注册数", "新注册并存款", "注册存款转化率"]
          broker_months.each do |broker_month|
            csv << [broker_month.broker_name, broker_month.sign_up_time, broker_month.state,
              broker_month.clink_visits, broker_month.member_count,
              broker_month.valuable_member_count, broker_month.display_valuable_rate]
          end
        end
      end


    end

  end
end

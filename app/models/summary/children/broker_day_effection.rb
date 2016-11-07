module Summary
  module Children

    class BrokerDayEffection < ChildrenBase
      attr_accessor :broker_days
            	    # 推广链接点击数	  注册数	         新注册并存款              注册存款转化率
      attr_accessor :clink_visits, :member_count, :valuable_member_count, :valuable_rate

      def initialize( children_broker, broker_days=[] )
        super(children_broker)
        self.broker_days = broker_days

        self.clink_visits, self.member_count = 0, 0
        self.valuable_member_count , self.valuable_rate = 0, 0

        initialize_attributes
      end

      def initialize_attributes
        broker_days.each{|day|
          self.clink_visits += day.clink_visits
          self.member_count += day.member_count
          self.valuable_member_count += day.valuable_member_count
        }
        self.valuable_rate = valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
      end

      def display_valuable_rate
        "%i%" % (valuable_rate*100)
      end

      def self.generate_csv(broker_days, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "推广链接点击数", "注册数", "新注册并存款", "注册存款转化率"]
          broker_days.each do |broker_day|
            csv << [broker_day.broker_name, broker_day.sign_up_time, broker_day.state,
              broker_day.clink_visits, broker_day.member_count,
              broker_day.valuable_member_count, broker_day.display_valuable_rate]
          end
        end
      end


    end

  end
end

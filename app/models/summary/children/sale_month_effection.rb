module Summary
  module Children

    class SaleMonthEffection < ChildrenBase
      attr_accessor :sale_months
            	    # 推广链接点击数	  注册数	         新注册并存款              注册存款转化率
      attr_accessor :clink_visits, :member_count, :valuable_member_count, :valuable_rate

      def initialize( children_broker, sale_months=[] )
        Rails.logger.debug "children_broker id=#{children_broker.id}, name=#{children_broker.name}"
        Rails.logger.debug "sale_months=#{sale_months.first.inspect}"
        super(children_broker)
        self.sale_months = sale_months

        self.clink_visits, self.member_count = 0, 0
        self.valuable_member_count , self.valuable_rate = 0, 0

        initialize_attributes
      end

      def initialize_attributes
        sale_months.each{|month|
          self.clink_visits += month.clink_visits
          self.member_count += month.member_count
          self.valuable_member_count += month.valuable_member_count
        }
        self.valuable_rate = valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
      end

      def display_valuable_rate
        "%i%" % (valuable_rate*100)
      end

      def self.generate_csv(sale_months, options = {})
        CSV.generate(options) do |csv|
          csv << ["会员", "注册时间", "状态", "推广链接点击数", "注册数", "新注册并存款", "注册存款转化率"]
          sale_months.each do |sale_month|
            csv << [sale_month.broker_name, sale_month.sign_up_time, sale_month.state,
              sale_month.clink_visits, sale_month.member_count,
              sale_month.valuable_member_count, sale_month.display_valuable_rate]
          end
        end
      end


    end

  end
end

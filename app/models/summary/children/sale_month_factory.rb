module Summary
  module Children

    class SaleMonthFactory

      def self.create( type, children_brokers, from_date, to_date )
        if type == "effection"
          children_brokers.map{|children_broker|
            sale_months = children_broker.sale_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthEffection.new( children_broker, sale_months)
          }
        elsif type == "profit"
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthProfit.new( children_broker, user_months)
          }
        else
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthBalance.new( children_broker, user_months)
          }
        end

      end

    end

  end
end

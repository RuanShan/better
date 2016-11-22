module Summary
  module Children

    class SaleDayFactory

      def self.create( type, children_brokers, from_date, to_date )
        if type == "effection"
          children_brokers.map{|children_broker|
            sale_days = children_broker.sale_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleDayEffection.new( children_broker, sale_days)
          }
        else
          children_brokers.map{|children_broker|
            user_days = children_broker.user_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleDayProfit.new( children_broker, user_days)
          }
        end

      end

    end

  end
end

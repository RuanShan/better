module Summary
  module Children

    class BrokerMonthFactory

      def self.create( type, children_brokers, from_date, to_date )
        if type == "effection"
          children_brokers.map{|children_broker|
            broker_months = children_broker.broker_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            BrokerMonthEffection.new( children_broker, broker_months)
          }
        elsif type == "profit"
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            BrokerMonthProfit.new( children_broker, user_months)
          }
        else
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            BrokerMonthBalance.new( children_broker, user_months)
          }
        end

      end

    end

  end
end

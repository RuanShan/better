module Summary
  module Children

    class BrokerMonthFactory

      def self.create( type, children_brokers, dates =[] )
        if type == "effection"
          children_brokers.map{|children_broker|
            broker_months = children_broker.broker_months.where( effective_on: @dates )
            BrokerMonth.new( children_broker, broker_months)
          }
        elsif type == "profit"
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where( effective_on: @dates )
            BrokerMonthProfit.new( children_broker, user_months)
          }
        else
          children_brokers.map{|children_broker|
            user_months = children_broker.user_months.where( effective_on: @dates )
            BrokerMonthBalance.new( children_broker, user_months)
          }
        end

      end

    end

  end
end

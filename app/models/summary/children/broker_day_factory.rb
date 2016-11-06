module Summary
  module Children

    class BrokerDayFactory

      def self.create( type, children_brokers, from_date, to_date )
        if type == "effection"
          children_brokers.map{|children_broker|
            broker_days = children_broker.broker_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            BrokerDay.new( children_broker, broker_days)
          }
        else
          children_brokers.map{|children_broker|
            user_days = children_broker.user_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            BrokerDayProfit.new( children_broker, user_days)
          }
        end

      end

    end

  end
end

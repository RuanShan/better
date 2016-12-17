module Summary
  module Children

    class SaleDayFactory

      def self.create( type, children, from_date, to_date )
        if type == "effection"
          children.map{|child|
            sale_days = child.sale_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleDayEffection.new( child, sale_days)
          }
        else
          children.map{|child|
            seller = child.as_seller
            member_days = seller.member_days.where( "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleDayProfit.new( seller, member_days)
          }
        end

      end

    end

  end
end

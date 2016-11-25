module Summary
  module Children

    class SaleMonthFactory

      def self.create( type, children, from_date, to_date )
        if type == "effection"
          children.map{|child|
            sale_months = child.sale_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthEffection.new( child, sale_months)
          }
        elsif type == "profit"
          children.map{|child|
            seller = child.as_seller

            member_months = seller.member_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthProfit.new( seller, member_months)
          }
        else
          children.map{|child|
            seller = child.as_seller
            member_months = seller.member_months.where(  "effective_on>=? and effective_on<=? ", from_date, to_date )
            SaleMonthBalance.new( seller, member_months)
          }
        end

      end

    end

  end
end

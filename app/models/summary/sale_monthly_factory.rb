module Summary
  #for profit and balance
  class SaleMonthlyFactory
    def self.create(type, user_months, dates=[])
      grouped_user_months = {}

      user_months.each{|month|
        grouped_user_months[month.effective_on] ||= []
        grouped_user_months[month.effective_on] << month
      }

      monthly_results = grouped_user_months.map{|date, months|
        type == "profit" ? SaleMonthlyProfit.new( date, months) : SaleMonthlyBalance.new( date, months)
      }
      results = monthly_results.sort { |x,y| y.effective_on <=> x.effective_on }
      if type == "profit"
        results
      else
        final_results = []
        unless results.empty?
          last_month_negative_balance = results.first.effective_on < dates.first ? results.first.last_month_negative_balance : 0
          last_month_object = nil
          dates.each do |date|
            broker_balance  = results.select{|result| result.effective_on == date}.first || SaleMonthlyBalance.new( date )
            broker_balance.last_month_negative_balance = last_month_negative_balance
            last_month_negative_balance = broker_balance.this_month_balance
            final_results << broker_balance
          end
        end
        final_results
      end
    end
  end
end

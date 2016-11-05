# user_month 计划任务 每天 開始的時候 維護昨天的信息, 月統計 + 昨日統計， 如3:00am
class MaintainUserMonth
  attr_accessor :specified_date

  def initialize( specified_date = nil)
    self.specified_date = specified_date || DateTime.current.to_date.yesterday
  end

  def run
    first_day_of_month =  DateTime.civil_from_format( :local, specified_date.year, specified_date.month, 1 ).to_date
    date = specified_date
    User.has_one :specified_date, ->{ where( effective_on: date )}, class_name: "UserDay"
    User.has_one :month_of_specifed_date, ->{ where( effective_on: first_day_of_month )}, class_name: "UserMonth"

    #TODO User 超过 1万 需要分页处理
    users = User.includes(:specified_date, :month_of_specifed_date).all

    users.each{|user|
      month = user.month_of_specifed_date || user.create_month_of_specifed_date!( )
      day = user.specified_date
      if day
        #deposit_amount, drawing_amount, bid_amount, bonus, profit, balance
        month.deposit_amount+=day.deposit_amount
        month.drawing_amount+=day.drawing_amount
        month.bid_amount+=day.bid_amount
        month.bonus+=day.bonus
        month.profit+=day.profit
        month.balance = day.balance
        month.save!
      end
    }

  end

end

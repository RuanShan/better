# user_month 计划任务 每天 開始的時候 維護昨天的信息, 月統計 + 昨日統計， 如3:00am
class MaintainUserMonth
  attr_accessor :specified_date

  def initialize( date = nil)
    self.specified_date = date || DateTime.current.to_date.yesterday
  end

  def run
    first_day_of_month =  DateTime.civil_from_format( :local, specified_date.year, specified_date.month, 1 ).to_date
    date = specified_date
    User.has_one :specified_date, ->{ where( effective_on: date )}, class_name: "UserDay"
    User.has_one :month_of_specifed_date, ->{ where( effective_on: first_day_of_month )}, class_name: "UserMonth"

    #TODO User 超过 10万 需要分页处理
    users = User.includes(:user_life, :specified_date, :month_of_specifed_date).all

    users.each{|user|
      month = user.month_of_specifed_date || user.create_month_of_specifed_date!( broker: user.broker)
      day = user.specified_date
      user_life = user.user_life
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
      #puts " user=#{user.inspect} user_life=#{user_life.inspect}"
      if user_life && day
        #deposit_amount, drawing_amount, bid_amount, bonus, profit, balance
        user_life.deposit_amount+=day.deposit_amount
        user_life.drawing_amount+=day.drawing_amount
        user_life.bid_amount+=day.bid_amount
        user_life.bonus+=day.bonus
        user_life.profit+=day.profit
        user_life.balance = day.balance
        user_life.save!
      end
    }

  end

end

# sale_month 计划任务 每天 開始的時候 維護昨天的信息, 月統計 + 昨日統計， 如3:00am
class MaintainSaleMonth
  attr_accessor :specified_date

  def initialize( specified_date = nil)
    self.specified_date = specified_date || DateTime.current.to_date.yesterday
  end

  def run
    first_day_of_month =  DateTime.civil_from_format( :local, specified_date.year, specified_date.month, 1 ).to_date
    date = specified_date
    Broker.has_one :specified_date, ->{ where( effective_on: date )}, class_name: "SaleDay"
    Broker.has_one :month_of_specifed_date, ->{ where( effective_on: first_day_of_month )}, class_name: "SaleMonth"

    #TODO Broker 超过 10万 需要分页处理
    brokers = Broker.includes(:specified_date, :month_of_specifed_date).all
    brokers.each{|broker|
      month = broker.month_of_specifed_date || broker.create_month_of_specifed_date!( )
      day = broker.specified_date
      if day
        #clink_visits, blink_visits, member_count, valuable_member_count, energetic_member_count
        month.clink_visits+=day.clink_visits
        month.blink_visits+=day.blink_visits
        month.member_count+=day.member_count
        month.valuable_member_count+=day.valuable_member_count
        #FIXME
        #month.energetic_member_count=day.energetic_member_count
        month.save!
      end
    }

  end



end

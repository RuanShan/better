# broker_month 计划任务 每天 開始的時候 維護昨天的信息, 月統計 + 昨日統計， 如3:00am
class MaintainBrokerMonth
  attr_accessor :specified_date

  def initialize( specified_date = nil)
    self.specified_date = specified_date || DateTime.current.to_date.yesterday
  end

  def run
   
  end



end

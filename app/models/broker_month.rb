class BrokerMonth < ApplicationRecord
  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_month_scope effective_on: [:current_month]

  belongs_to :broker

  def valuable_rate
     valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
  end

  def display_valuable_rate
    "%i%" % (valuable_rate*100)
  end

  def net
    drawing_amount + balance - deposit_amount
  end

  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << ["月份", "点击数", "注册数", "新注册并存款", "注册存款转化率"]
      all.each do |broker_month|
        values = [broker_month.effective_on.to_s(:year_month), broker_month.clink_visits, broker_month.member_count, broker_month.valuable_member_count, broker_month.display_valuable_rate]
        csv << values
      end
    end
  end

end

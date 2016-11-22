class SaleDay < ApplicationRecord
  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :broker

  def valuable_rate
     valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
  end

  def display_valuable_rate
    "%i%" % (valuable_rate*100)
  end

  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << ["日期", "推广链接点击数", "注册数", "新注册并存款", "注册存款转化率"]
      all.each do |sale_day|
        values = [sale_day.effective_on, sale_day.clink_visits, sale_day.member_count, sale_day.valuable_member_count, sale_day.display_valuable_rate]
        csv << values
      end
    end
  end
end

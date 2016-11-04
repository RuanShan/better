class BrokerDay < ApplicationRecord
  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :broker

  def valuable_rate
     valuable_member_count == 0 ? 0 : ( valuable_member_count/ member_count.to_f ).round(2)
  end
end

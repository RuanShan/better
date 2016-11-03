class BrokerDay < ApplicationRecord
  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :broker

  def valuable_rate
     valuable_user_counter == 0 ? 0 : ( valuable_user_counter/ user_counter.to_f ).round(2)
  end
end

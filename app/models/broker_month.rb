class BrokerMonth < ApplicationRecord
  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_date_scope effective_on: [:current_month]

  belongs_to :broker

end

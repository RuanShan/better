# 用户账户信息统计
class UserLife < ApplicationRecord
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :user
  belongs_to :broker, optional: true


end

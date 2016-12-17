# 用户账户信息统计
class UserLife < ApplicationRecord
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :user
  belongs_to :broker, optional: true

  #可用现金
  def net_cash
    balance > delta_cash ? delta_cash : 0;
  end

  #可用赠金
  def net_bonus
    balance - delta_cash
  end

  def delta_cash
    deposit_amount - drawing_amount
  end
end

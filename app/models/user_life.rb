# 用户账户信息统计
class UserLife < ApplicationRecord
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :user
  belongs_to :broker, optional: true

  #
  def recompute!
    self.deposit_amount = user.deposits.with_state(:success).sum(:amount)
    self.drawing_amount = user.drawings.with_state(:success).sum(:amount)
    self.bid_amount = user.bids.sum(:amount)
    bonuses = user.wallets.bonuses.includes(:originator)
    self.bonus = bonuses.select{|bonus| bonus.originator.is_a? Deposit }.sum(&:amount)

    # 赢了多前
    self.profit =bonuses.select{|bonus| bonus.originator.is_a? Bid }.sum(&:amount)

    self.balance = user.wallets.sum(:amount)

    self.save!
  end

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

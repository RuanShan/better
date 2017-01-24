class UserMonth < ApplicationRecord
  extend BetterDateScope
  better_month_scope effective_on: [:current_month]

  extend DisplayMoney
  money_methods  :bid_amount, :bid_difference, :balance, :bonus, :profit, :net, :net_difference

  belongs_to :user, required: true
  belongs_to :broker, optional: true

  # only for select( ... count(*) as group_count ).group( fields )
  #attribute :group_count, :integer, default: 0
  #before_validation :set_current_as_effective_on
  before_create :set_default_attribues

  attr_reader :net, :bid_difference, :net_difference

  def net
    drawing_amount + balance - deposit_amount
  end

  def bid_difference
    0
  end

  def net_difference
    0
  end

  def broker_months
    self.class.where(broker_id: broker_id, effective_on: effective_on)
  end

  private
  #def set_current_as_effective_on
  #  effective_on = DateTime.civil_from_format :local, DateTime.current.year, DateTime.current.month, 1
  #end

  def set_default_attribues
    #broker: user.broker, balance: user.user_life.balance
    broker = user.broker
    balance = user.user_life.balance
  end
end

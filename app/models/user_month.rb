class UserMonth < ApplicationRecord
  extend BetterDateScope
  better_month_scope effective_on: [:current_month, :last_month]

  belongs_to :user, required: true
  belongs_to :broker, optional: true

  # only for select( ... count(*) as group_count ).group( fields )
  #attribute :group_count, :integer, default: 0
  #before_validation :set_current_as_effective_on
  before_create :set_default_attribues

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

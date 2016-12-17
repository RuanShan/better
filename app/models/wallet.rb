# 存钱/投注/红利/盈利 都会发生钱包的变化
#
# type      deposit  deposit_bonus  bid   bid_principal  bid_bonus
# amount      +         +           -        +              +
# is_bonus   false    true         false    false          true
#
#

class Wallet < ApplicationRecord
  extend DisplayMoney
  money_methods :amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :user, required: true
  belongs_to :originator, polymorphic: true

  scope :bonuses, -> { where(is_bonus: true) }

  after_create :adjust_days

  def self.search_bonuses(search_params, user_id=nil)
    search_conditions = "created_at>? and created_at<?"
    search_cvalues = [(search_params["start_date"]+" 00:00:00").to_time(:utc),
    (search_params["end_date"]+" 23:59:59").to_time(:utc)]
    unless user_id.nil?
      search_conditions += " and user_id=?"
      search_cvalues << user_id
    end
    self.where([search_conditions,search_cvalues].flatten).order("created_at desc").all
  end

  private

  def adjust_days
    DayUpdater.new( self ).process!
  end

end

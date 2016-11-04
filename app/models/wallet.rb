class Wallet < ApplicationRecord
  extend DisplayMoney
  money_methods :amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :user, required: true

  scope :bonuses, -> { where(is_bonus: true) }

  after_create :adjust_days

  def self.search_bonuses(search_params)
    self.bonuses.where("created_at>? and created_at<?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime).order("created_at desc").all
  end

  private

  def adjust_days
    DayUpdater.new( self ).process!
  end

end

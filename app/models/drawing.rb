class Drawing < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  belongs_to :user_bank
  belongs_to :game_center
  accepts_nested_attributes_for :user_bank
  delegate :user, to: :user_bank

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  #每笔最少提款：50.00
  #每笔最多提款：50,000.00
  #每天最多提款：200,000.00
  #每天提款次数：50
  validates :amount, numericality: { greater_than_or_equal_to: 50, less_than_or_equal_to: 50000}

  before_create :set_state
  after_create :add_to_wallet

  validate do |drawing|
    drawing.validate_amount
  end

  def method
    user_bank.name
  end

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end

  def self.drawings_for_day(date=Time.zone.today)
    self.where("created_at>? and created_at<? and state=1",(date.to_s+" 00:00:00").to_datetime,
    (date.to_s+" 23:59:59").to_datetime).order("created_at desc").all
  end

  def self.drawings_amount_for_day(date=Time.zone.today)
    drawings_for_day(date).inject(0){|total_amount,d|total_amount+=d.amount}
  end

  def set_state
    self.game_center_id=1
    self.state=1
  end

  def validate_amount
    message = ""
    if amount > user.center_wallet_balance
      message = "amount greater than balance"
    end
    if self.class.drawings_for_day.size == 50
      message = "drawing over 50 times"
    end
    if self.class.drawings_amount_for_day+amount > 200000
      message = "drawing over 200,000.00"
    end
    self.errors.add(:amount, message) if message.present?
  end

  def add_to_wallet
    UserWallet.add_wallet(self)
  end

end

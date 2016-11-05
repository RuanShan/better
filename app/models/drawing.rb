# 提款处理过程： 创建提款记录 -> 后台审核提款 -> 处理提款  -> 提款成功
#                                        -> 提款失败
class Drawing < ApplicationRecord

  extend DisplayMoney
  money_methods :amount
  extend  DisplayDateTime
  date_time_methods :created_at

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  has_one :wallet, as: :originator
  belongs_to :user_bank, required: true
  accepts_nested_attributes_for :user_bank
  delegate :user, to: :user_bank
  delegate :name, to: :user_bank, prefix: true

  scope :on_date, ->(datetime){ where( ["created_at>? and created_at<=?",  datetime.beginning_of_day, datetime.end_of_day] )}
  scope :today, ->{ on_date( DateTime.current ) }
  #每笔最少提款：50.00
  #每笔最多提款：50,000.00
  #每天最多提款：200,000.00
  #每天提款次数：50

  validates :amount, numericality: { greater_than_or_equal_to: 50, less_than_or_equal_to: 50000}

  validate do |drawing|
    # validate require user presence and is a new record, saved record could cause valid amount get error
    drawing.validate_amount if user_bank && self.new_record?
  end

  # 缺省状态是等待处理， 即 pending: 0
  state_machine :state, initial: :pending do
    # pending: 等待处理
    # success: 提款成功
    # failure: 提款失败
    after_transition to: :success, do: :adjust_wallet

    event :process do
      transition pending: :success, if: ->(drawing) { drawing.valid_to_process? }
      transition pending: :failure, if: ->(drawing) { !drawing.valid_to_process? }
    end
  end

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end

  def valid_to_process?
    #TODO
    # available money to transfer    true
  end

  def adjust_wallet
    create_wallet!( user: user, amount: -self.amount, is_bonus: false )
  end

  def validate_amount
    message = ""
    if amount > user.wallet_balance
      message = "amount greater than balance"
    end
    if user.drawings_count_today == 50
      message = "drawing over 50 times"
    end
    if user.drawings_sum_today + amount > 200000
      message = "drawing over 200,000.00"
    end
    self.errors.add(:amount, message) if message.present?
  end
end

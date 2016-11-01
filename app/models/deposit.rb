# 充值处理过程： 创建充值记录 -> 处理充值 -> 充值成功
# =>                                  -> 充值失败
# 转账初始状态为 pending
class Deposit < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  #extend FriendlyId
  #friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'D0', length: 20, letters: true)

  belongs_to :payment_method, required: true
  belongs_to :user, required: true
  has_many :wallets, as: :originator # 一条充值记录可能有1个或两个钱包记录。 如：促销活动

  delegate :name, to: :payment_method, prefix: true
  delegate :nickname, to: :user, prefix: true

  validates :amount, numericality: { greater_than_or_equal_to: 50, less_than_or_equal_to: 50000}

  # 缺省状态是等待处理， 即 pending: 0
  state_machine :state, initial: :pending do
    # pending: 等待处理
    # success: 充值成功
    # failure: 充值失败
    after_transition to: :success, do: :adjust_wallet

    event :process do
      transition pending: :success, if: ->(deposit) { deposit.valid_to_process? }
      transition pending: :failure, if: ->(deposit) { !deposit.valid_to_process? }
    end
  end

  def do_with_promotion
    if promotion_code.present?
      if promotion.present?
        unless promotion.valid_amount?(amount)
          promotion_code_error_message= "this promotion need to deposit at lest #{promotion.factor1}"
        end
      else
        promotion_code_error_message= "promotion code doesn't exists"
      end
    end
    if promotion_code_error_message.present?
      errors.add(:promotion_code, promotion_code_error_message)
    else
      self.save
    end
  end

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end

  def promotion
    Promotion.find_by_code(promotion_code)
  end

  def valid_to_process?
    #TODO
    # available money to transfer
    persisted? ? true : false
  end

  def adjust_wallet
    wallets.create!( user: user, amount: self.amount, is_bonus: false )
    if promotion.present?
      logger.debug "promotion=#{promotion.inspect}"
      bonus = promotion.compute_bonus(amount)
      logger.debug "bonus=#{bonus.inspect}"
      wallets.create!( user: user, amount: bonus, is_bonus: true )
    end

  end

end

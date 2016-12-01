# 充值处理过程： 创建充值记录 -> 处理充值 -> 充值成功
# =>                                  -> 充值失败
# 转账初始状态为 pending
class Deposit < ApplicationRecord
  NUMBER_PROFIX = "DZ"

  extend DisplayMoney
  money_methods :amount
  extend  DisplayDateTime
  date_time_methods :created_at

  #extend FriendlyId
  #friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: NUMBER_PROFIX, length: 20, letters: false)

  belongs_to :payment_method, required: true
  belongs_to :user, required: true
  belongs_to :promotion, primary_key: :number, foreign_key: :promotion_number, optional: true
  has_many :wallets, as: :originator # 一条充值记录可能有1个或两个钱包记录。 如：促销活动

  delegate :name, to: :payment_method, prefix: true
  delegate :nickname, to: :user, prefix: true

  validates :amount, numericality: { greater_than_or_equal_to: 50, less_than_or_equal_to: 50000}

  # 缺省状态是等待处理， 即 pending: 0
  state_machine :state, initial: :pending do
    # pending: 等待处理
    # success: 充值成功
    # failure: 充值失败
    after_transition to: :success, do: [ :adjust_wallet ]

    event :process do
      transition pending: :success, if: ->(deposit) { deposit.valid_to_process? }
      transition pending: :failure, if: ->(deposit) { !deposit.valid_to_process? }
    end
  end

  def do_with_promotion
    if promotion_number.present?
      if promotion.present?
        unless promotion.valid_amount?(amount)
          promotion_number_error_message= "活动需要至少充值#{promotion.factor1}元"
        end
      else
        promotion_number_error_message= "活动代码不存在"
      end
    end
    if promotion_number_error_message.present?
      errors.add(:promotion_number, promotion_number_error_message)
    else
      self.save
      #TODO remove process in prodution
      self.process!
    end
  end

  def self.search(search_params, user_id=nil)
    search_conditions = "created_at>? and created_at<? and state=?"
    search_cvalues = [(search_params["start_date"]+" 00:00:00").to_time(:utc),
    (search_params["end_date"]+" 23:59:59").to_time(:utc),search_params["state"]]
    unless user_id.nil?
      search_conditions += " and user_id=?"
      search_cvalues << user_id
    end
    self.where([search_conditions,search_cvalues].flatten).order("created_at desc").all
  end

  #def promotion
  #  Promotion.find_by_number(promotion_number)
  #end

  def valid_to_process?
    #TODO
    # available money to transfer
    persisted? ? true : false
  end

  def adjust_wallet
    # add wallet
    wallets.create!( user: user, amount: self.amount, is_bonus: false )
    if promotion.present?
      bonus = promotion.compute_bonus(amount)
      wallets.create!( user: user, amount: bonus, is_bonus: true )
    end
  end

end

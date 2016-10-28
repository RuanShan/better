# 充值处理过程： 创建充值记录 -> 处理充值 -> 充值成功
# =>                                  -> 充值失败
# 转账初始状态为 pending
class Deposit < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  belongs_to :payment_method, required: true
  belongs_to :user, required: true
  has_many :wallets, as: :originator # 一条充值记录可能有1个或两个钱包记录。 如：促销活动

  delegate :name, to: :payment_method, prefix: true
  delegate :nickname, to: :user, prefix: true

  attr_accessor :bonus

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

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end


  def valid_to_process?
    #TODO
    # available money to transfer
    true
  end

  def adjust_wallet

    wallets.create!( user: user, amount: self.amount, is_bonus: false )
    #TODO handle promotion code
      #if originator.bonus>0
      #  bonus_param = wallet_param.dup
      #  bonus_param[:amount] = originator.bonus
      #  bonus_param[:is_bonus]=true
      #  wallet_params << bonus_param
      #end
  end

end

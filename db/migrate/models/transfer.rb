# 转账处理过程： 创建转账 -> 处理转账 -> 转账成功
#                                -> 转账失败
# 转账初始状态为 pending

class Transfer < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  belongs_to :user
  belongs_to :from_game_center, class_name: 'GameCenter'
  belongs_to :to_game_center, class_name: 'GameCenter'

  has_many :wallets, as: :originator
  # 缺省状态是等待处理， 即 pending: 0
  #enum state: { failure:0, pending: 2, success:1, unknown:4 }

  state_machine :machine_state, initial: :pending do
    # pending: 等待处理
    # success: 转账成功
    # failure: 转账失败
    after_transition on: :success do
      # :adjust_wallet
    end

    event :process do
      transition pending: :success, if: ->(transfer) { transfer.valid_to_process? }
      transition pending: :failure, if: ->(transfer) { !transfer.valid_to_process? }
    end
  end

  before_create :set_state
  after_create :add_to_wallet

  def self.search(search_params)
    self.where("created_at>? and created_at<? and from_game_center_id=? and to_game_center_id=? and state=?",
    (search_params["start_date"]+" 00:00:00").to_datetime,(search_params["end_date"]+" 23:59:59").to_datetime,search_params["from_game_center_id"],search_params["to_game_center_id"],search_params["state"]).order("created_at desc").all
  end

  def set_state
    self.state=1
  end

  def add_to_wallet
    UserWallet.add_wallet(self)
  end

  private

  def valid_to_process?
  # available money to transfer
  end

  def adjust_wallet
  end

end

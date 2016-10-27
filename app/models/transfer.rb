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

  validates_presence_of :from_game_center, :to_game_center, :user
  validates :amount, numericality: true#{ greater_than_or_equal_to: 50, less_than_or_equal_to: 50000}

  # 缺省状态是等待处理， 即 pending: 0
  #enum state: { failure:0, pending: 2, success:1, unknown:4 }

  state_machine :machine_state, initial: :pending do
    # pending: 等待处理
    # success: 转账成功
    # failure: 转账失败
    after_transition to: :success, do: :adjust_wallet

    event :process do
      transition pending: :success, if: ->(transfer) { transfer.valid_to_process? }
      transition pending: :failure, if: ->(transfer) { !transfer.valid_to_process? }
    end
  end

  #before_create :set_state
  #after_create :add_to_wallet

  def self.search(search_params)
    self.where("created_at>? and created_at<? and from_game_center_id=? and to_game_center_id=? and machine_state=?",
    (search_params["start_date"]+" 00:00:00").to_datetime,(search_params["end_date"]+" 23:59:59").to_datetime,search_params["from_game_center_id"],search_params["to_game_center_id"],search_params["state"]).order("created_at desc").all
  end

  def valid_to_process?
    #TODO
    # available money to transfer
    true
  end

  private


  def adjust_wallet

    from_wallet = wallets.build
    from_wallet.game_center_id = from_game_center_id
    from_wallet.amount = - self.amount

    to_wallet = wallets.build
    to_wallet.game_center_id = to_game_center_id
    to_wallet.amount = self.amount

    wallets<< from_wallet
    wallets<< to_wallet

  end

end

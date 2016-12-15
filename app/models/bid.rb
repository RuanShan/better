class Bid < ApplicationRecord
  extend DisplayMoney
  money_methods :amount, :win_lose_amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :game_round , required: true
  belongs_to :user, required: true

  state_machine :status, initial: :pending do
    # pending: 等待处理
    # success: 结束
    # failure:
    after_transition to: :complete, do: [ :adjust_wallet ]

    event :complete do
      transition pending: :success, if: ->(bid) { bid.valid_to_process? }
      transition pending: :failure, if: ->(bid) { !bid.valid_to_process? }
    end
  end

  delegate :game, to: :game_round

  def platform
    game.name
  end

  def win_lose_amount
    amount*rate
  end

  def profit
    complete? ?   amount*rate : 0;
  end

  def self.search(search_params, user_id=nil)
    search_conditions = "bids.created_at>? and bids.created_at<? and games.id=?"
    search_cvalues = [(search_params["start_date"]+" 00:00:00").to_time(:utc),
    (search_params["end_date"]+" 23:59:59").to_time(:utc),search_params["game_id"]]
    unless user_id.nil?
      search_conditions += " and bids.user_id=?"
      search_cvalues << user_id
    end
    self.includes(game_round: :game).where([search_conditions,search_cvalues].flatten).order("bids.created_at desc").references(:game_rounds, :games).all
  end

  def human_state

    "到期在  #{self.game_round.end_at.to_s(:hm ) }" if pending?
  end


  def valid_to_process?
    # has enough money
    # available money to transfer    true
    user.user_life.balance > amount
  end

  def adjust_wallet
    create_wallet!( user: user, amount: -self.amount, is_bonus: false )
  end
end

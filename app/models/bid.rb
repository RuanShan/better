class Bid < ApplicationRecord
  extend DisplayMoney
  money_methods :amount, :win_lose_amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :game_round
  belongs_to :user

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  delegate :game, to: :game_round

  def platform
    game.name
  end

  def win_lose_amount
    amount*rate
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

end

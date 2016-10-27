class Bid < ApplicationRecord
  belongs_to :game_round
  belongs_to :user

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  delegate :game, to: :game_round
  delegate :game_center, to: :game

  def platform
    game.name
  end

  def win_lose_amount
    amount*rate
  end

  def self.search(search_params)
    self.includes(game_round: :game).where("bids.created_at>? and bids.created_at<? and games.id=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["game_id"]).references(:game_rounds, :games).all
  end

end

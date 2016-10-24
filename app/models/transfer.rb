class Transfer < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  belongs_to :user
  belongs_to :from_game_center, class_name: 'GameCenter'
  belongs_to :to_game_center, class_name: 'GameCenter'

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

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

end

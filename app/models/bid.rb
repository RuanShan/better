class Bid < ApplicationRecord
  extend DisplayMoney
  money_methods :amount, :win_lose_amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :game_round , required: true
  belongs_to :user, required: true
  has_one :wallet, as: :originator

  #enum highlow: { high: 1, low: 0 }
  enum state: { pending: 0, win: 1, lose: 4 }

  after_create :adjust_wallet
  validate :has_enough_money

  delegate :game, to: :game_round

  def platform
    game.nil? ? "" : game.name
  end

  def win_lose_amount
    rate ||= 0.7
    case state
    when "win"
      amount*rate
    when "lose"
      -amount
    else
      0
    end
  end

  def profit
    win? ?   win_lose_amount : 0;
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

  def complete_game_round(param_quote)
    quote, hack_quote = RedisService.get_quote_by_time(game_round.instrument_code, game_round.end_at)
    game_round.instrument_quote = quote
    game_round.instrument_hack_quote = hack_quote
    game_round.complete
    #complete!
    self.reload
  end

  def adjust_wallet
    create_wallet!( user: user, amount: -self.amount, originator: self, is_bonus: false )
  end


  def has_enough_money
    #Rails.logger.debug "#{user.wallets.inspect}#{user.id} user.life_statis.balance=#{user.life_statis.balance}, amount=#{amount}"
    errors.add(:base, 'Must has enough money') if user.life_statis.balance < amount
  end

  def complete!
    rate ||= 0.7
    if highlow.to_i==1 && self.last_quote> game_round.instrument_quote || highlow.to_i==0 && self.last_quote< game_round.instrument_quote
      create_wallet!( user: user, amount: self.amount, originator: self, is_bonus: false )
      create_wallet!( user: user, amount: amount*rate , originator: self, is_bonus: true )
      win!
    else
      lose!
    end
  end

  def save_with_simulator(session)
    game_round.end_at = game_round.start_at.since( game_round.period)
    self.created_at = DateTime.current # it is required to show
    session["sbid"] = self
    session["sgame_round"] = game_round
  end

end

class Bid < ApplicationRecord
  extend DisplayMoney
  money_methods :amount, :net_amount
  extend  DisplayDateTime
  date_time_methods :created_at

  extend BetterDateScope
  better_date_time_scope created_at: [:before_today]

  belongs_to :game_round , required: true
  belongs_to :user, required: true
  has_one :wallet, as: :originator

  #enum highlow: { high: 1, low: 0 }
  enum state: { pending: 0, win: 1, lose: 4 }

  after_create :adjust_wallet
  before_validation :fix_last_quote, on: [:create]

  validate :custom_validate,  on: [:create] #ex. has_enough_money

  delegate :game, to: :game_round

  def platform
    game.nil? ? "" : game.name
  end

  def net_amount
    self.rate ||= 0.7
    case state
    when "win"
      amount * self.rate
    when "lose"
      -amount
    else
      0
    end
  end

  def income
    win? ?   amount + profit : -amount;
  end

  def profit
    win? ?   net_amount : 0;
  end

  def self.search(search_params, user_id=nil)
    search_conditions = "bids.created_at>? and bids.created_at<? and game_rounds.instrument_code=?"
    search_cvalues = [(search_params["start_date"]+" 00:00:00").to_time(:utc),
    (search_params["end_date"]+" 23:59:59").to_time(:utc),search_params["game_id"]]
    unless user_id.nil?
      search_conditions += " and bids.user_id=?"
      search_cvalues << user_id
    end
    self.includes(:game_round).where([search_conditions,search_cvalues].flatten).order("bids.created_at desc").references(:game_rounds).all
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


  def custom_validate
    errors.add(:base, '抱歉，指数必须>0！') if self.last_quote<=0

    #Rails.logger.debug "#{user.wallets.inspect}#{user.id} user.life_statis.balance=#{user.life_statis.balance}, amount=#{amount}"
    errors.add(:base, '抱歉，投资失败，资金余额不足！') if user.life_statis.balance < amount

    game_instrument = game_round.game_instrument
    # is open time
    available_at = game_instrument.available_at
    errors.add(:base, "当前资产的开放时间是 #{available_at}" ) unless game_instrument.is_open_at?( game_round.start_at )

    # is period enabled
    errors.add(:base, "当前资产的投注时段暂不开放" ) unless game_instrument.is_period_enabled?( game_round )

    # is amount < max
    max_price = game_instrument.get_max_price( game_round )

    if game_round.persisted?
      total = game_round.bids.where( user: user).sum(:amount)
      errors.add(:base, "投注最高限额为#{max_price}"  ) unless game_instrument.is_price_enabled?( total+amount, game_round )
    else
      errors.add(:base, "投注最高限额为#{max_price}"  ) unless game_instrument.is_price_enabled?(amount, game_round )
    end

  end

  def complete!
    #rate ||= 0.7
    if highlow==1 && self.last_quote < game_round.final_instrument_quote || highlow==0 && self.last_quote > game_round.final_instrument_quote
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

  def fix_last_quote
    if self.last_quote<=0
      #quote, hack_quote = RedisService.get_quote_by_time( game_round.instrument_code, DateTime.current.ago(1) )
      Rails.logger.debug "ERROR quote = 0"
      #self.last_quote = quote
    end
  end

end

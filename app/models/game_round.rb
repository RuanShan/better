class GameRound < ApplicationRecord
#period5m_enabled, period30s_enabled, period60s_enabled, period120s_enabled, period300s_enabled
#period5m_max_price, period30s_max_price, period60s_max_price, period120s_max_price, period300s_max_price

  belongs_to :game
  belongs_to :game_instrument, foreign_key: 'instrument_code', primary_key: 'code'

  extend  DisplayDateTime
  date_time_methods :start_at, :end_at

  has_many :bids, dependent: :destroy
  before_create :set_end_at

  scope :last_round, ->{ with_state(:success).where(['end_at>= ?', DateTime.current.ago(5*60)])}

  state_machine :state, initial: :pending do
    # pending: 等待处理
    # started: 等待处理
    # success: 结束
    after_transition to: :success, do: [ :complete_bids ]
    after_transition to: :started, do: [ :update_bid_count ]

    event :start_up do
      transition  pending: :started
    end

    event :complete do
      transition any => :success
    end
  end

  def self.search(search_params)
    if search_params.present?
      if search_params["end_date"].present?
        time_start = search_params['end_time'].present? ? search_params['end_time'] : "00:00"
        time_end = search_params['end_time'].present? ? search_params['end_time'] : "23:59"
        search_conditions = "game_rounds.end_at>=? and game_rounds.end_at<=?"
        search_cvalues = [(search_params["end_date"]+" #{time_start}:00").to_time.utc,
        (search_params["end_date"]+" #{time_end}:59").to_time.utc]
        sconditions = [search_conditions,search_cvalues].flatten
      else
        sconditions = "1"
      end
    else
      sconditions = "1"
    end
    self.includes(:game_instrument).where(sconditions).order("game_rounds.end_at desc").references(:instruments).all
  end

  def time_to_close?
    DateTime.current > self.end_at
  end

  def complete_bids
    bids.each(&:complete!)

  end

  def desplay_instrument_quote
    final_instrument_quote
  end

  def high_bids
    bids.select{|bid| bid.highlow == 1}
  end

  def low_bids
    bids.select{|bid| bid.highlow == 0}
  end



  def final_instrument_quote
    instrument_hack_quote>0 ?  instrument_hack_quote : instrument_quote
  end

  def hack_none?
    custom_highlow == 0
  end

  def hack_win?
    custom_highlow == 1
  end

  def hack_lose?
    custom_highlow == 2
  end

  ##################################################################
  #  redis store related methods
  ##################################################################
  def expected_quote_hash
    # hmset  name:hm_week_start_at  key: symbol_end_at  val: expected_quote_highlow
    quote, highlow = get_platform_expected_quote

    if quote > 0
      val = [ quote, highlow].join('_')
      { expected_quote_key => val }
    else
      {}
    end
  end

  #symbol_end_at_highlow_period
  def expected_quote_key
    key = [ self.instrument_code, self.end_at.to_i ].join('_')
  end

  def get_platform_expected_quote
    amount_for_high = high_bids.sum(&:amount)
    amount_for_low = low_bids.sum(&:amount)

    highlow = 1
    quote = 0
    if amount_for_high > amount_for_low
      quote = high_bids.map(&:last_quote).sort.first
      highlow = 0
    elsif  amount_for_high < amount_for_low
      quote = low_bids.map(&:last_quote).sort.last
    end
    return quote,highlow
  end

  def update_bid_count
    self.bid_count = bids.count
    self.save!
  end

  private
  def set_end_at
    self.end_at = start_at.since( self.period)
  end

end

class GameRound < ApplicationRecord
  belongs_to :game
  belongs_to :game_instrument, foreign_key: 'instrument_code', primary_key: 'code'

  extend  DisplayDateTime
  date_time_methods :end_at

  has_many :bids
  before_create :set_end_at

  scope :last_round, ->{ with_state(:success).where(['end_at>= ?', DateTime.current.ago(5*60)])}

  state_machine :state, initial: :pending do
    # pending: 等待处理
    # success: 结束
    after_transition to: :success, do: [ :complete_bids ]

    event :complete do
      transition pending: :success
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

  def complete_bids
    bids.each(&:complete!)
  end

  def desplay_instrument_quote
    instrument_quote
    #if instrument_code  == "USUSDJPY"
    #  instrument_quote*1.0/100;
    #else
    #  instrument_quote*1.0/10000;
    #end
  end



  private
  def set_end_at
    self.end_at = start_at.since( self.period)
  end

end

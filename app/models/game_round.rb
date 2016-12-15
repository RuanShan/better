class GameRound < ApplicationRecord
  belongs_to :game
  extend  DisplayDateTime
  date_time_methods :end_at

  before_create :set_end_at

  state_machine :state, initial: :pending do
    # pending: 等待处理
    # success: 结束
    after_transition to: :complete, do: [ :complete_bids ]

    event :complete do
      transition pending: :success
    end
  end

  def complete_bids

  end

  private
  def set_end_at
    self.end_at = start_at.since( self.period)
  end
end

class GameRound < ApplicationRecord
  belongs_to :game
  extend  DisplayDateTime
  date_time_methods :end_at

  def end_at
    start_at.since( self.period)
  end
end

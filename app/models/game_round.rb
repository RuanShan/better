class GameRound < ApplicationRecord
  belongs_to :game

  def end_at
    start_at.since( self.period)
  end
end

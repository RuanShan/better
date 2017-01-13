class GameInstrument < ApplicationRecord
  #self.per_page = 4

  has_one :last_game_round, ->{ last_round }, primary_key: :code, foreign_key: :instrument_code, class_name: 'GameRound'

  enum category_id: { currency: 0, index: 1, stock: 2, product: 3, xxx: 4 }

  scope :hot, ->{ where hot: true }

  def display_rate
    rates = rate.split(",")
    rates.empty? ? "0%" : (rates.size == 1 ? rates.first+"%" : get_time_rate+"%")
  end

  def get_time_rate
    "70"
  end

  def display_default_rate
    "%i%" % (default_rate*100)
  end


end

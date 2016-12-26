class GameInstrument < ApplicationRecord
  self.per_page = 4

  enum category_id: { currency: 0, index: 1, stock: 2, product: 3, xxx: 4 }

  scope :hot, ->{ where hot: true }

  def display_rate
    rates = rate.split(",")
    rates.empty? ? "0%" : (rates.size == 1 ? rates.first+"%" : get_time_rate+"%")
  end

  def get_time_rate
    "70"
  end
end

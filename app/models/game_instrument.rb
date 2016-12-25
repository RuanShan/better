class GameInstrument < ApplicationRecord
  self.per_page = 4

  enum category_id: { currency: 0, index: 1, stock: 2, product: 3, xxx: 4 }

  scope :hot, ->{ where hot: true }
end

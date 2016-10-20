class Transfer < ApplicationRecord
  belongs_to :user
  belongs_to :from_game_center, class_name: 'GameCenter'
  belongs_to :to_game_center, class_name: 'GameCenter'

end

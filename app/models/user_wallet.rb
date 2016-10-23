class UserWallet < ApplicationRecord
  belongs_to :user
  belongs_to :game_center
end

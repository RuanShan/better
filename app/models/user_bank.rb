class UserBank < ApplicationRecord
  belongs_to :user
  validates :name, :card_number, :branch_name, :address, presence: true

end

class UserBank < ApplicationRecord
  #acts_as_paranoid
  include NumberFormatting

  enum state:{ pending: 0, green: 1, red: 4}
  belongs_to :user
  has_many :drawings
  validates :name, :card_number, :branch_name, :address, presence: true

  # Returns a display-friendly version of the card number.
  #
  # All but the last 4 numbers are replaced with an "X", and hyphens are
  # inserted in order to improve legibility.
  #
  # @example
  #   user_bank = UserBank.new(:number => "2132542376824338")
  #   user_bank.display_number  # "**4338"
  #
  # @return [String] a display-friendly version of the card number
  def display_number
    self.class.mask(number)
  end
end

class UserBank < ApplicationRecord
  #acts_as_paranoid
  include NumberFormatting

  enum state:{ pending: 0, green: 1, red: 4}
  belongs_to :user
  has_many :drawings

  has_attached_file :card_front, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  has_attached_file :card_back, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :card_front, :card_back, content_type: /\Aimage\/.*\z/

  validates :name, :card_number, :address, presence: true

  attr_accessor :current_money_password


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

class UserBank < ApplicationRecord
  #acts_as_paranoid
  include NumberFormatting
  extend  DisplayDateTime
  date_time_methods :created_at

  enum state:{ pending: 0, green: 1, red: 4}
  belongs_to :user
  belongs_to :broker, foreign_key: :user_id
  has_many :drawings

  has_attached_file :card_front, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :card_back, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  validates_attachment_content_type :card_front, :card_back, content_type: /\Aimage\/.*\z/

  validates :name, :card_number, :address, presence: true

  attr_accessor :current_money_password

  before_save :validate_bank

  def self.valid_create(user, bank_options)
    user.password_prefix="money_"
    current_money_password = bank_options["current_money_password"]
    new_user_bank = user.user_banks.build(bank_options)
    if new_user_bank.id.present? && user.user_banks.pluck(:id).include?(new_user_bank.id.to_i)
      new_user_bank = UserBank.find(new_user_bank.id)
    end
    if user.valid_password? current_money_password
      unless new_user_bank.persisted?
        new_user_bank.save
      end
    else
      new_user_bank.errors.add(:current_money_password, "当前资金密码不正确")
    end
    new_user_bank
  end


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

  def validate_bank
    id_number = user ? user.id_number : broker.id_number
    real_name = user ? user.real_name : broker.real_name
    error_code, result = Juhe::Bank.verify_bank(card_number, id_number, real_name)
    if error_code.to_i == 0
      match = result["res"].to_i == 1 ? true : false
      errors.add(:card_number, "真实姓名和银行卡号不匹配，请重新输入") unless match
    else
      errors.add(:card_number, "验证失败 : #{result}")
    end
  end
end

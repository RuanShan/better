class Deposit < ApplicationRecord
  extend DisplayMoney
  money_methods :amount

  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'R')

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  belongs_to :payment_method, required: true
  belongs_to :user, required: true

  delegate :name, to: :payment_method, prefix: true
  delegate :nickname, to: :user, prefix: true
end

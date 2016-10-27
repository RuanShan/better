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

  attr_accessor :bonus

  def bonus
    @bonus ? @bonus : 0
  end

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end
end

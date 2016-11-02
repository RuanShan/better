class Broker < ApplicationRecord

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  # 添加 日注册，月注册 scope
  extend BetterDateScope
  better_date_time_scope created_at: [:today, :month]

  # 产生推广码
  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new( prefix: 'B', length: 10, letters: true )

  has_many :members, class_name: 'User'

  alias_attribute :name, :nickname


  #
end

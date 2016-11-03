class Broker < ApplicationRecord
  acts_as_nested_set
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

  # 代理的下级成员
  has_many :members, class_name: 'User'
  has_many :user_days, through: :members
  #
  has_many :members_registed_today, ->{ today }, class_name: 'User'

  # 代理的日统计
  has_many :broker_days
  has_one  :broker_today, ->{ today }, class_name: 'BrokerDay'


  alias_attribute :name, :nickname


  #
end

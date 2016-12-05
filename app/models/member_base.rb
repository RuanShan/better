class MemberBase < ApplicationRecord
  self.table_name = "users"

  #支持多级会员系统
  acts_as_nested_set #scope: [:type]
  acts_as_paranoid

  extend  DisplayDateTime
  date_time_methods :created_at

  extend BetterDateScope
  better_date_time_scope created_at: [:today, :month]

  # 产生推广码
  #extend FriendlyId
  #friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new( prefix: 'B', length: 10, letters: true )

  #用户每日信息统计
  has_many :user_days, foreign_key: :user_id
  has_many :user_months, foreign_key: :user_id
  has_one  :user_today, ->{ today }, class_name: 'UserDay', foreign_key: :user_id
  has_one  :user_cmonth, ->{ current_month }, class_name: 'UserMonth', foreign_key: :user_id
  has_one  :user_life, foreign_key: :user_id

  # 對於一般用戶，下级会员 就是 children
  has_many :child_days, through: :children, source: :user_days
  has_many :child_months, through: :children, source: :user_months
  has_many :child_todays, ->{ today }, through: :children, source: :user_days
  has_many :child_cmonths, ->{ current_month },through: :children, source: :user_months

  # 销售的日统计
  has_many :sale_days, foreign_key: :seller_id, class_name: 'SaleDay'
  has_one  :sale_today, ->{ today }, foreign_key: :seller_id, class_name: 'SaleDay'

  # 销售的月统计
  has_many :sale_months, foreign_key: :seller_id
  has_one  :sale_cmonth, ->{ current_month }, foreign_key: :seller_id, class_name: 'SaleMonth'

  # call it before destroy_descendants
  before_destroy :adjust_children_parent, prepend: true

  delegate :energetic_member_count, :clink_visits, :member_count, to: :sale_cmonth, allow_nil: true


  def real_name
    country_code == "CN" ? "#{last_name}#{first_name}" : "#{first_name} #{last_name}"
  end

  def adjust_children_parent
    children.update( parent: self.parent)
  end

end

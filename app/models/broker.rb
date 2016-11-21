class Broker < User
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  # 添加 日注册，月注册 scope
  #extend BetterDateScope
  #better_date_time_scope created_at: [:today, :month]
  #extend  DisplayDateTime
  #date_time_methods :created_at

  has_many :user_banks, foreign_key: :user_id
  accepts_nested_attributes_for :user_banks

  # 代理的下级成员
  has_many :members, class_name: 'User'
  has_many :user_days, through: :members

  has_many :user_months, through: :members
  #
  has_many :members_registed_today, ->{ today }, class_name: 'User'

  # 代理的日统计
  has_many :broker_days
  has_one  :broker_today, ->{ today }, class_name: 'BrokerDay'

  has_many :broker_months
  has_one  :broker_cmonth, ->{ current_month }, class_name: 'BrokerMonth'
  has_many :user_cmonths, ->{ current_month }, class_name: 'UserMonth'
  has_many :user_todays, ->{ today }, class_name: 'UserDay'

  delegate :energetic_member_count, :clink_visits, :member_count, to: :broker_cmonth, allow_nil: true

  alias_attribute :nickname, :real_name

  def state
    locked_at.nil? ? "normal" : "frozen"
  end

  def change_password(password_options)
    if valid_password? password_options["current_password"]
      reset_password(password_options["password"],password_options["password_confirmation"] )
    else
      errors.add(:current_password, "当前密码不正确")
    end
  end

  def parent_name
    parent.present? ? parent.name : "无"
  end

  def filtered_children(filter_condition)
    self.class.where("parent_id=? #{filter_condition}", self.id).all
  end


end

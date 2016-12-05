class Broker < MemberBase
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable, :lockable

  # 添加 日注册，月注册 scope
  #extend BetterDateScope
  #better_date_time_scope created_at: [:today, :month]
  #extend  DisplayDateTime
  #date_time_methods :created_at

  has_many :user_banks, foreign_key: :user_id
  accepts_nested_attributes_for :user_banks

  # 代理的下级会员
  has_many :members, class_name: 'User'
  has_many :member_days, through: :members, source: :user_days
  has_many :member_months, through: :members, source: :user_months
  #
  has_many :members_registed_today, ->{ today }, class_name: 'User'

  # 代理的日统计
  #has_many :sale_days, foreign_key: :seller_id
  #has_one  :sale_today, ->{ today }, foreign_key: :seller_id, class_name: 'SaleDay'
  # 代理的月统计
  #has_many :sale_months, foreign_key: :seller_id
  #has_one  :sale_cmonth, ->{ current_month }, foreign_key: :seller_id, class_name: 'SaleMonth'

  has_many :member_cmonths, ->{ current_month }, class_name: 'UserMonth'
  has_many :member_todays, ->{ today }, class_name: 'UserDay'

  #default_scope ->{ where( type: 'Broker' )}
  alias_attribute :nickname, :real_name

  #before_destroy :reassign_members

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
    parent.present? ? parent.real_name : "无"
  end

  def filtered_children(filter_condition)
    self.class.where("parent_id=? #{filter_condition}", self.id).all
  end

  def website_url
    website.present? ? (website[0,7] == "http://" ? website : "http://"+website) : "无"
  end

  private

  def reassign_members
    members.update( broker: self.parent )
  end
end

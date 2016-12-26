class MemberBase < ApplicationRecord
  self.table_name = "users"
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :lockable

  #支持多级会员系统
  acts_as_nested_set scope: [:type]
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

  attr_reader :money_password, :current_money_password, :broker_number
  attr_accessor :money_password_confirmation, :password_prefix, :binding_name, :setting_money_pwd, :validate_code

  attr_reader :avatar_remote_url
  has_attached_file :avatar, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_front, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_back, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  validates_attachment_content_type :avatar, :id_front, :id_back, content_type: /\Aimage\/.*\z/


  validates :money_password, confirmation: true
  validates :money_password, presence: true, if: :setting_money_pwd
  validates :first_name, presence: true
  validates :last_name, presence: true, if: :binding_name
  validates :email, uniqueness: true
  validates :id_number, uniqueness: true, allow_blank: true
  validates :phone, length: { in: 7..11 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(member) { member.phone.present? or member.binding_name }
  validates :qq, length: { in: 5..10 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(member) { member.qq.present? }

  # call it before destroy_descendants
  before_destroy :adjust_children_parent, prepend: true

  delegate :energetic_member_count, :clink_visits, :member_count, to: :sale_cmonth, allow_nil: true

  def display_name
    nickname.present? ? nickname : real_name
  end

  def real_name
    country_code == "CN" ? "#{last_name}#{first_name}" : "#{first_name} #{last_name}"
  end

  def adjust_children_parent
    children.update( parent: self.parent)
  end

  def as_seller
    CurrentSeller.new( self )
  end

  def change_password(password_options)
    @password_prefix = password_options["money_password"] ? "money_" : ""
    @setting_money_pwd = true if @password_prefix == "money_"
    compared_password = password_options["current_#{@password_prefix}password"]
    if valid_password? compared_password
      reset_password(password_options["#{@password_prefix}password"],password_options["#{@password_prefix}password_confirmation"] )
    else
      if @password_prefix == ""
        errors.add("current_#{@password_prefix}password", "当前密码不正确")
      else
        errors.add("current_#{@password_prefix}password", "当前资金密码不正确")
      end
    end
  end

  def password_prefix
    "" unless @password_prefix
  end

  def money_password=(new_password)
    @money_password = new_password
    self.encrypted_money_password = password_digest(@money_password) if @money_password.present?
  end

  def has_money_password?
    db_member = self.class.find(id)
    db_member.encrypted_money_password.present?
  end

  def valid_password?(password)
    return true if @password_prefix == "money_" && !has_money_password?
    Devise::Encryptor.compare(self.class, self.send("encrypted_#{@password_prefix}password"), password)
  end

  private

  def reset_password(new_password, new_password_confirmation)
    self.send "#{@password_prefix}password=", new_password
    self.send "#{@password_prefix}password_confirmation=", new_password_confirmation
    save
  end

end

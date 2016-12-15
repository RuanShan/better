require "id_card.rb"
# 用户存款总额计算
# 用户7日内的流水计算
#  user.bids.week.sum(:amount)

class User < MemberBase
  include WalletBlance

  has_many :user_messages
  has_many :user_banks
  has_many :deposits
  has_many :drawings
  has_many :bids

  belongs_to :broker, optional: true


  enum role: [:user, :vip ]
  enum gender: [:secret, :male, :female ]
  enum id_type: [:id_card, :passport]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :lockable

  has_attached_file :avatar, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_front, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_back, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  validates_attachment_content_type :avatar, :id_front, :id_back, content_type: /\Aimage\/.*\z/

  #default_scope ->{ where( type: 'User' )}
  # it is for filter
  scope :unlocked, ->{ where( locked_at: nil )}
  scope :locked, ->{ where.not( locked_at: nil )}


  after_initialize :set_default_role, :if => :new_record?
  after_create :adjust_sale_day, if: :broker
  after_create :add_user_life

  alias_attribute :nickname, :real_name


  attr_reader :money_password, :current_money_password, :broker_number
  attr_accessor :money_password_confirmation, :password_prefix, :setting_pp, :binding_name, :validate_code
  validates :money_password, confirmation: true
  validates :pp_question, :pp_answer, presence: true, if: :setting_pp
  validates :first_name, presence: true
  validates :last_name, presence: true, if: :binding_name
  validates :email, uniqueness: true
  validates :id_number, uniqueness: true, allow_blank: true
  validates :phone, length: { in: 7..11 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(user) { user.phone.present? or user.binding_name }
  validates :qq, length: { in: 5..10 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(user) { user.qq.present? }

  #for broker list members
  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << ["用户名/ID", "注册时间", "用户类型", "状态"]
      all.each do |user|
        values = [user.nickname, user.display_created_at, user.role, user.state]
        csv << values
      end
    end
  end


  def set_default_role
    self.role ||= :user
  end

  def state
    locked_at.nil? ? "normal" : "frozen"
  end

  def password_prefix
    "" unless @password_prefix
  end

  def money_password=(new_password)
    @money_password = new_password
    self.encrypted_money_password = password_digest(@money_password) if @money_password.present?
  end

  def valid_password?(password)
    Devise::Encryptor.compare(self.class, self.send("encrypted_#{@password_prefix}password"), password)
  end

  def change_password(password_options)
    @password_prefix = password_options["money_password"] ? "money_" : ""
    if valid_password? password_options["current_#{@password_prefix}password"]
      reset_password(password_options["#{@password_prefix}password"],password_options["#{@password_prefix}password_confirmation"] )
    else
      errors.add(:current_password, "当前密码不正确")
    end
  end

  def admin_change_password(password_options, administrator_id)
    self.administrator_id = administrator_id
    @password_prefix = password_options["money_password"] ? "money_" : ""
    reset_password(password_options["#{@password_prefix}password"],password_options["#{@password_prefix}password_confirmation"] )
  end

  def set_email(email_options)
    if valid_password? email_options["current_password"]
      self.email = email_options["email"]
      save
    else
      errors.add(:current_password, "当前密码不正确")
    end
  end

  def set_password_protection(pp_options)
    @setting_pp = true
    current_password = pp_options.delete("current_password")
    if valid_password? current_password
      if pp_options['pp_question'].present?
        errors.add(:pp_answer, "请输入密保问题") if pp_options['pp_answer'].blank?
      else
        errors.add(:pp_question, "请输入密保答案")
      end
      self.update_attributes(pp_options)
    else
      errors.add(:current_password, "当前密码不正确")
    end
  end

  def admin_set_password_protection(pp_options, administrator_id)
    @setting_pp = true
    if pp_options['pp_question'].present?
      errors.add(:pp_answer, "请输入答案") if pp_options['pp_answer'].blank?
    else
      errors.add(:pp_question, "请输入密保问题")
    end
    self.administrator_id = administrator_id
    self.update_attributes(pp_options)
  end

  def bind_name(name_options)
    @binding_name = true
    self.assign_attributes(name_options)
    if id_type == "id_card"
      error_code, result = Juhe::IdCard.search(id_number, real_name)
      if error_code.to_i == 0
        match = result["res"].to_i == 1 ? true : false
        errors.add(:first_name, "真实姓名和身份证不匹配，请重新输入") unless match
      else
        errors.add(:first_name, "验证失败 : #{result}")
      end
      self.save if self.errors.empty?
    end
  end

  def drawing(drawing_options)
    new_user_bank = bind_bank(drawing_options['user_bank_attributes'])
    new_drawing = self.drawings.build
    new_drawing.user_bank = new_user_bank
    if new_user_bank.errors.empty?
      new_drawing.amount = drawing_options['amount']
      new_drawing.save
    end
    new_drawing
  end

  def security_score
    score = 0
    score+= 30 if encrypted_password.present?
    score+= 15 if bind_name?
    score+= 15 if has_money_password?
    score+= 20 if bind_bank?
    score+= 10 if bind_email?
    score+= 10 if set_password_protection?
    score
  end

  def has_money_password?
    encrypted_money_password.present?
  end

  def bind_name?
    first_name.present? && last_name.present? && id_number.present?
  end

  def bind_bank?
    user_banks.present?
  end

  def bind_email?
    email.present?
  end

  def set_password_protection?
    pp_question.present? && pp_answer.present?
  end
  #============================money===========================================
  def center_wallet_balance
    #wallets.master.sum(:amount)
    wallets.inject(0){|total_amount,w|total_amount+=w.amount}
  end

  def drawings_today
    user_banks.inject([]){|dt, ub|dt.concat(ub.drawings.today)}
  end

  def drawings_count_today
    drawings_today.size
    #user_banks.inject(0){|drawings_count, ub|drawings_count+=ub.drawings.today.count}
  end

  def drawings_sum_today
    drawings_today.pluck(:amount).sum
  end

#============================messages===========================================
  def private_messages
    Message.where("state=?",id).all
  end

  def received_messages
    Message.where("state in (0,#{id})").order("created_at DESC").all
  end

  def available_messages
    messages_array = received_messages.select{|rm| !(rm.deleted_by? id)}
    Message.where(id: messages_array.map(&:id)).order("created_at DESC").all
  end

  def read?(message_id)
    UserMessage.exists?(["user_id=? and message_id=? and state=1", id, message_id])
  end

  def read_message(message_id)
    unless read? message_id
      UserMessage.create(:user_id=>id, :message_id=>message_id, :state=>1)
    end
  end

  def read_messages
    received_messages.each{|received_message| read_message received_message.id }
  end

  def delete_message(message_id)
    #do we delete message record if the message is private?
    deleted_message = UserMessage.find_or_create_by(:user_id=>id, :message_id=>message_id)
    deleted_message.state=0
    deleted_message.save
  end

  def delete_messages
    available_messages.each{|am|delete_message(am.id)}
  end

  # Assuming country_select is used with User attribute `country_code`
  # This will attempt to translate the country name and use the default
  # (usually English) name if no translation is available
  def country_name
    country = ISO3166::Country[country_code]
    country.translations[I18n.locale.to_s] || country.name
  end



  def full_members
    descendants.where(["depth>? AND depth<=?", self.depth, self.depth+6])
  end

  private

  def reset_password(new_password, new_password_confirmation)
    self.send "#{@password_prefix}password=", new_password
    self.send "#{@password_prefix}password_confirmation=", new_password_confirmation
    save
  end

  def adjust_sale_day
    if broker
      day = broker.sale_today || broker.build_sale_today
      day.member_count+=1
      day.save!
    end

    if parent
      day = parent.sale_today || parent.build_sale_today
      day.member_count+=1
      day.save!
    end
  end

  def add_user_life
    UserLife.create!( user: self, broker: broker, effective_on: DateTime.current )
  end


end

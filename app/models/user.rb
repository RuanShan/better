require "id_card.rb"
# 用户存款总额计算
# 用户7日内的流水计算
#  user.bids.week.sum(:amount)

class User < ApplicationRecord
  include WalletBlance
  #支持多级会员系统
  acts_as_nested_set scope: [:type]

  extend  DisplayDateTime
  date_time_methods :created_at

  extend BetterDateScope
  better_date_time_scope created_at: [:today, :month]

  # 产生推广码
  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new( prefix: 'B', length: 10, letters: true )

  has_many :user_messages
  has_many :user_banks
  has_many :deposits
  has_many :drawings
  has_many :bids

  belongs_to :broker, optional: true
  #用户每日信息统计
  has_many :user_days
  has_many :user_months
  has_one  :user_today, ->{ today }, class_name: 'UserDay'
  has_one  :user_cmonth, ->{ current_month }, class_name: 'UserMonth'
  has_one  :user_life

  has_many :sale_days, class_name: 'SaleDay'
  has_one  :sale_today, ->{ today }, class_name: 'SaleDay'

  enum role: [:user, :vip ]
  enum gender: [:secret, :male, :female ]
  enum id_type: [:id_card, :passport]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  has_attached_file :avatar, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_front, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  has_attached_file :id_back, :whiny => false, styles: { medium: "300x300>", thumb: "100x100>" }
  validates_attachment_content_type :avatar, :id_front, :id_back, content_type: /\Aimage\/.*\z/

  # it it for filter
  scope :unlocked, ->{ where( locked_at: nil )}
  scope :locked, ->{ where.not( locked_at: nil )}


  after_initialize :set_default_role, :if => :new_record?
  after_create :adjust_sale_day, if: :broker
  after_create :add_user_life
  alias_attribute :name, :nickname


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

  def real_name
    country_code == "cn" ? "#{last_name}#{first_name}" : "#{first_name} #{last_name}"
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

  def save_with_validate_code(send_code, attr_options, code_options)
    self.assign_attributes(attr_options)

    if send_code == 1
      code=123456
=begin
      code =rand(999999).to_s
      alidayu_respond = Alidayu.send_sms({
        template_id: "SMS_22595044",
        sign_name: "软山网络",#软山网络,大连软山
        params: {
          code: code,
          product: '',
        },
        phones: phone
      })
      #logger.debug "----------------code=#{code},alidayu_respond=#{alidayu_respond.inspect}"
      validate_alidayu_response(alidayu_respond)
=end
      if errors.empty?
        code_options["validate_phone"] = phone
        code_options["validate_code"] = code
        code_options["validate_code_send_time"] = Time.now
      end
      errors.add(:validate_code, "验证码已发送至您的手机，请输入")
    else
      validate_my_code(code_options)
      if code_options["validate_phone"] == phone
        if @binding_name == true
          if id_type == "id_card"
            error_code, result = Juhe::IdCard.search(id_number, real_name)
            if error_code.to_i == 0
              match = result["res"].to_i == 1 ? true : false
              errors.add(:first_name, "真实姓名和身份证不匹配，请重新输入") unless match
            else
              errors.add(:first_name, "验证失败 : #{result}")
            end
          end
        end
        self.save if self.errors.empty?
      else
        errors.add(:phone, "必须使用发送验证码的电话号码")
      end
    end
  end

  def bind_name(send_code, name_options, code_options)
    @binding_name = true
    save_with_validate_code(send_code, attr_options, code_options)
  end

  def bind_bank(bank_options)
    @password_prefix="money_"
    current_money_password = bank_options["current_money_password"]
    new_user_bank = user_banks.build(bank_options)
    if new_user_bank.id.present? && user_banks.pluck(:id).include?(new_user_bank.id.to_i)
      new_user_bank = UserBank.find(new_user_bank.id)
    end
    if valid_password? current_money_password
      unless new_user_bank.persisted?
        error_code, result = Juhe::Bank.verify_bank(new_user_bank.card_number, id_number, real_name)
        if error_code.to_i == 0
          match = result["res"].to_i == 1 ? true : false
          new_user_bank.errors.add(:card_number, "真实姓名和银行卡号不匹配，请重新输入") unless match
        else
          new_user_bank.errors.add(:card_number, "验证失败 : #{result}")
        end
        new_user_bank.save if new_user_bank.errors.empty?
      end
    else
      new_user_bank.errors.add(:current_money_password, "当前资金密码不正确")
    end
    new_user_bank
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

  private

  def reset_password(new_password, new_password_confirmation)
    self.send "#{@password_prefix}password=", new_password
    self.send "#{@password_prefix}password_confirmation=", new_password_confirmation
    save
  end

  def validate_my_code(code_options)
    if code_options["validate_code"].present? && code_options["validate_code_send_time"].present?
      last_send_duration = Time.now - code_options["validate_code_send_time"].to_datetime
      if last_send_duration > 10*60
        errors.add(:validate_code, "验证码过期，请重新发送")
      else
        #logger.debug "++++++++++validate_code=#{validate_code},code_options['validate_code']=#{code_options['validate_code']}"
        unless validate_code.to_s == code_options["validate_code"].to_s
          errors.add(:validate_code, "验证码不正确")
        end
      end
    else
      errors.add(:validate_code, "请先发送验证码至手机，再输入")
    end
  end
  #error_respond={"error_response"=>{"code"=>15, "msg"=>"Remote service error", "sub_code"=>"isv.BUSINESS_LIMIT_CONTROL", "sub_msg"=>"触发业务流控", "request_id"=>"3b4kmfzkvbq7"}}
  #success_respond={"alibaba_aliqin_fc_sms_num_send_response"=>{"result"=>{"err_code"=>"0", "model"=>"104132741839^1105207555898", "success"=>true}, "request_id"=>"z24nkhmlp79h"}}
  def validate_alidayu_response(alidayu_response)
    if alidayu_response["error_response"]
      error_code = alidayu_response["error_response"]["code"]
      case error_code
      when 15
      when 40
        errors.add(:phone, "请输入手机号")
      else
        error_message = alidayu_response["error_response"]["msg"]+":"+alidayu_response["error_response"]["sub_msg"]
        errors.add(:validate_code, error_message)
      end
    else
      rresponse = alidayu_response["alibaba_aliqin_fc_sms_num_send_response"]["result"]
      unless rresponse["success"] == true
        errors.add(:validate_code, "发送失败，请重新发送")
      end
    end
  end

  def adjust_sale_day
    day = broker.sale_today || broker.build_sale_today
    day.member_count+=1
    day.save!
  end

  def add_user_life
    UserLife.create!( user: self, broker: broker, effective_on: DateTime.current )
  end


end

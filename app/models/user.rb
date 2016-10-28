class User < ApplicationRecord
  include WalletBlance

  has_many :user_messages
  has_many :user_banks
  has_many :deposits
  has_many :drawings
  has_many :transfers
  has_many :bids

  enum role: [:user, :vip ]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  after_initialize :set_default_role, :if => :new_record?
  alias_attribute :name, :nickname

  attr_reader :money_password, :current_money_password
  attr_accessor :money_password_confirmation, :password_prefix, :setting_pp, :binding_name, :validate_code
  validates :money_password, confirmation: true
  validates :pp_question, :pp_answer, presence: true, if: :setting_pp
  validates :real_name, :id_number, presence: true, if: :binding_name
  validates :phone, length: { in: 7..11 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(user) { user.phone.present? or user.binding_name }
  validates :qq, length: { in: 5..10 }, format: { with: /\A\d+\z/, message: "must be number" }, if: ->(user) { user.qq.present? }

  def set_default_role
    self.role ||= :user
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
    @password_prefix = password_options[:money_password] ? "money_" : ""
    if valid_password? password_options["current_#{@password_prefix}password"]
      reset_password(password_options["#{@password_prefix}password"],password_options["#{@password_prefix}password_confirmation"] )
    else
      errors.add(:current_password, "not right")
    end
  end

  def set_email(email_options)
    if valid_password? email_options["current_password"]
      self.email = email_options["email"]
      save
    else
      errors.add(:current_password, "not right")
    end
  end

  def set_password_protection(pp_options)
    @setting_pp = true
    current_password = pp_options.delete("current_password")
    if valid_password? current_password
      if pp_options['pp_question'].present?
        errors.add(:pp_answer, "can not be blank") if pp_options['pp_answer'].blank?
      else
        errors.add(:pp_question, "can not be blank")
      end
      self.update_attributes(pp_options)
    else
      errors.add(:current_password, "not right")
    end
  end

  def bind_name(send_code, name_options, session)
    @binding_name = true
    self.assign_attributes(name_options)
    if send_code == 1
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
      if errors.empty?
        session["validate_phone"] = phone
        session["validate_code"] = code
        session["validate_code_send_time"] = Time.now
      end
      errors.add(:validate_code, "validate code sended to your phone, please input the code")
    else
      validate_my_code(session)
      if session["validate_phone"] == phone
        self.save
      else
        errors.add(:phone, "phone number must be the one send validate code!")
      end
    end
  end

  def bind_bank(current_money_password,bank_options)
    @password_prefix="money_"
    if valid_password? current_money_password
      user_banks.create(bank_options)
    else
      new_user_bank = user_banks.new
      new_user_bank.errors.add(:current_money_password, "not right")
      new_user_bank
    end
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
    real_name.present?
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
    wallets.master.sum(:amount)
    #wallets.inject(0){|total_amount,w|total_amount+=w.amount}
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

  private

  def reset_password(new_password, new_password_confirmation)
    self.send "#{@password_prefix}password=", new_password
    self.send "#{@password_prefix}password_confirmation=", new_password_confirmation
    save
  end

  def validate_my_code(session)
    if session["validate_code"].present? && session["validate_code_send_time"].present?
      last_send_duration = Time.now - session["validate_code_send_time"].to_datetime
      if last_send_duration > 10*60
        errors.add(:validate_code, "validate code timeout, please send again!")
      else
        logger.debug "++++++++++validate_code=#{validate_code},session['validate_code']=#{session['validate_code']}"
        unless validate_code == session["validate_code"]
          errors.add(:validate_code, "validate code not right!")
        end
      end
    else
      errors.add(:validate_code, "please send validate code!")
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
        errors.add(:phone, "please input your phone number")
      else
        error_message = alidayu_response["error_response"]["msg"]+":"+alidayu_response["error_response"]["sub_msg"]
        errors.add(:validate_code, error_message)
      end
    else
      rresponse = alidayu_response["alibaba_aliqin_fc_sms_num_send_response"]["result"]
      unless rresponse["success"] == true
        errors.add(:validate_code, "send fail! please resend!")
      end
    end
  end


end

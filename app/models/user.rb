class User < ApplicationRecord
  has_many :user_messages
  enum role: [:user, :vip ]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :deposits

  after_initialize :set_default_role, :if => :new_record?
  alias_attribute :name, :nickname

  attr_reader :money_password, :current_money_password
  attr_accessor :money_password_confirmation, :password_prefix
  validates :money_password, confirmation: true

  def set_default_role
    self.role ||= :user
  end

  def change_password(password_options)
    @password_prefix = password_options[:money_password] ? "money_" : ""
    if valid_password? password_options["current_#{@password_prefix}password"]
      reset_password(password_options["#{@password_prefix}password"],password_options["#{@password_prefix}password_confirmation"] )
    else
      errors.set(:current_password, ["not right"])
    end
  end

  def reset_password(new_password, new_password_confirmation)
    self.send "#{@password_prefix}password=", new_password
    self.send "#{@password_prefix}password_confirmation=", new_password_confirmation
    save
  end

  def money_password=(new_password)
    @money_password = new_password
    self.encrypted_money_password = password_digest(@money_password) if @money_password.present?
  end

  def valid_password?(password)
    Devise::Encryptor.compare(self.class, self.send("encrypted_#{@password_prefix}password"), password)
  end

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
end

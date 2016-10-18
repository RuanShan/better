class User < ApplicationRecord
  has_many :user_messages
  enum role: [:user, :vip, :admin]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :deposits

  after_initialize :set_default_role, :if => :new_record?
  alias_attribute :name, :nickname  


  def set_default_role
    self.role ||= :user
  end



  def read_messages
    user_messages.each{|user_message|
      user_message.read
    }
  end
end

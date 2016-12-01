class Administrator < ApplicationRecord
  extend  DisplayDateTime
  date_time_methods :created_at
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, uniqueness: true

  def name
    email.split("@")[0]
  end

end

class Message < ApplicationRecord
  extend  DisplayDateTime
  date_time_methods :created_at, :updated_at

  belongs_to :administrator
  has_many :user_messages

  enum message_type: [:system, :user, :broker]
  enum state: [:unsend, :have_send]

  scope :system_messages, -> { where(message_type: 0) }

  def send_self
    self.state = 1
    self.save
  end

  def deleted_by?(user_id)
    UserMessage.exists?(["user_id=? and message_id=? and state=0",user_id, id])
  end
end

class Message < ApplicationRecord

  enum state: { system: 0 }
  belongs_to :administrator, foreign_key: :user_id
  has_many :user_messages
  self.per_page = 10

  scope :public_messages, -> { where(user_id: 0) }

  def deleted_by?(user_id)
    UserMessage.exists?(["user_id=? and message_id=? and state=0",user_id, id])
  end
end

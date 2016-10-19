class Message < ApplicationRecord

  enum state: { system: 0 }
  belongs_to :administrator, foreign_key: :user_id
  has_many :user_messages
end

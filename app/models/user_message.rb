class UserMessage < ApplicationRecord
  enum state: { deleted: 0, read: 1 }
  belongs_to :user
  belongs_to :message

  delegate :title, :content, to: :message
  self.per_page = 10

end

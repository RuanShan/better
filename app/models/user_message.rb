class UserMessage < ApplicationRecord
  belongs_to :user
  belongs_to :message

  delegate :title, :content, to: :message

end

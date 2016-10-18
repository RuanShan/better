class UserMessage < ApplicationRecord
  belongs_to :user
  belongs_to :message

  delegate :title, :content, to: :message
  
  self.per_page = 10

  def read?
    state == 1 ? true : false
  end

  def read
    unless read?
      self.state=1
      self.save!
    end
  end
end

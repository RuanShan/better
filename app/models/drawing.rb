class Drawing < ApplicationRecord
  belongs_to :user_bank
  delegate :user, to: :user_bank
  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  def method
    user_bank.name
  end

  def self.search(search_params)
    self.where("created_at>? and created_at<? and state=?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime,search_params["state"]).order("created_at desc").all
  end
end

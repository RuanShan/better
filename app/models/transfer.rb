class Transfer < ApplicationRecord
  belongs_to :user
  belongs_to :from_game_center, class_name: 'GameCenter'
  belongs_to :to_game_center, class_name: 'GameCenter'

  enum state: { failure:0, pending: 2, success:1, unknown:4 }

  def self.search(search_params)
    self.where("created_at>? and created_at<? and from_game_center_id=? and to_game_center_id=? and state=?",
    (search_params["start_date"]+" 00:00:00").to_datetime,(search_params["end_date"]+" 23:59:59").to_datetime,search_params["from_game_center_id"],search_params["to_game_center_id"],search_params["state"]).all
  end

end

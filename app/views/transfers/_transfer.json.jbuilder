json.extract! transfer, :id, :user_id, :from_game_center_id, :to_game_center, :number, :amount, :state, :created_at, :updated_at
json.url transfer_url(transfer, format: :json)
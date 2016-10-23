json.extract! user_wallet, :id, :user_id, :game_center_id, :amount, :memo, :deleted_at, :created_at, :updated_at
json.url user_wallet_url(user_wallet, format: :json)
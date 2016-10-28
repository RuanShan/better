json.extract! wallet, :id, :user_id,  :amount, :memo, :deleted_at, :created_at, :updated_at
json.url wallet_url(wallet, format: :json)

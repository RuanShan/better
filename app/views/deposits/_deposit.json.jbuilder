json.extract! deposit, :id, :payment_method_id, :user_id, :amount, :state, :created_at, :updated_at
json.url deposit_url(deposit, format: :json)
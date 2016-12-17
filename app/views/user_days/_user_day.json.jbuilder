json.extract! user_day, :id, :user_id, :effective_on, :deposit_amount, :drawing_amount, :bid_amount, :bonus, :created_at, :updated_at
json.url user_day_url(user_day, format: :json)
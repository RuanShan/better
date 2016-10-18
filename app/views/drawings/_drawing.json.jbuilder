json.extract! drawing, :id, :user_bank_id, :number, :amount, :state, :created_at, :updated_at
json.url drawing_url(drawing, format: :json)
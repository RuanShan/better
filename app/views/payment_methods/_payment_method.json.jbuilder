json.extract! payment_method, :id, :name, :merchant, :pid, :key, :state, :enabled, :created_at, :updated_at
json.url payment_method_url(payment_method, format: :json)
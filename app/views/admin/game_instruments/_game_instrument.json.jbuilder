json.extract! game_instrument, :id, :name, :code, :description, :hot, :default_rate, :decimal, :created_at, :updated_at
json.url game_instrument_url(game_instrument, format: :json)
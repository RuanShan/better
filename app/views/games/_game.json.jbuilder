json.extract! game, :id, :name, :slug, :description, :state, :created_at, :updated_at
json.url game_url(game, format: :json)
json.extract! game_round, :id, :instrumet_code, :start_at, :end_at, :period, :created_at, :updated_at
json.url game_round_url(game_round, format: :json)
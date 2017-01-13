class AddHackQuoteToGameRounds < ActiveRecord::Migration[5.0]
  def change
    add_column :game_rounds, :instrument_hack_quote, :decimal, scale: 6, precision: 14,  null: false, default: 0.0
  end
end

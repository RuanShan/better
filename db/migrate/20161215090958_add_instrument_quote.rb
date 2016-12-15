class AddInstrumentQuote < ActiveRecord::Migration[5.0]
  def change
    #
    add_column :game_rounds, :instrument_quote, :decimal, null: false, default: 0

  end
end

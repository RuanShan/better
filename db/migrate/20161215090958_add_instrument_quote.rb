class AddInstrumentQuote < ActiveRecord::Migration[5.0]
  def change
    #
    add_column :bids, :status, :string

    add_column :game_rounds, :instrument_quote, :decimal, null: false, default: 0
    add_column :game_rounds, :state, :string
    add_column :game_rounds, :end_at, :datetime

    add_index :game_rounds, [:instrument_quote, :state, :end_at]

  end
end

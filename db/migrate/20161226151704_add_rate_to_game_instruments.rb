class AddRateToGameInstruments < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :rate, :string, null: false, default: ''
  end
end

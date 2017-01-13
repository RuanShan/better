class AddScaleToGameInstruments < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :scales, :integer, null: false, default: 0
  end
end

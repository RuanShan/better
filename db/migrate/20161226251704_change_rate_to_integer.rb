class ChangeRateToInteger < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :default_rate, :integer, null: false, default: 70 # 70%
  end
end

class ChangeRateToInteger < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :default_rate, :decimal, scale: 2, precision: 6,  null: false, default: 0.70 # 70%
  end
end

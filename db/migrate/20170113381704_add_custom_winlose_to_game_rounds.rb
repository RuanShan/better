class AddCustomWinloseToGameRounds < ActiveRecord::Migration[5.0]
  def change
    # 0: no hack, 1: win, 2: lose
    add_column :game_rounds, :custom_highlow, :integer,  null: false, default: 0
  end
end

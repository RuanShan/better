class AddPeriodConfigsIntoGameInstruments < ActiveRecord::Migration[5.0]
  def change

    add_column :game_instruments, :period5m_enabled, :integer, null: false, default: 1
    add_column :game_instruments, :period30s_enabled, :integer, null: false, default: 1
    add_column :game_instruments, :period60s_enabled, :integer, null: false, default: 1
    add_column :game_instruments, :period120s_enabled, :integer, null: false, default: 1
    add_column :game_instruments, :period300s_enabled, :integer, null: false, default: 1

    add_column :game_instruments, :period5m_max_price, :integer, null: false, default: 0
    add_column :game_instruments, :period30s_max_price, :integer, null: false, default: 0
    add_column :game_instruments, :period60s_max_price, :integer, null: false, default: 0
    add_column :game_instruments, :period120s_max_price, :integer, null: false, default: 0
    add_column :game_instruments, :period300s_max_price, :integer, null: false, default: 0

  end
end

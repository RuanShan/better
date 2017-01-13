class AddMoreIntoGameInstruments < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :day1_open_at, :time
    add_column :game_instruments, :day1_close_at, :time
    add_column :game_instruments, :day2_open_at, :time
    add_column :game_instruments, :day2_close_at, :time
    add_column :game_instruments, :day3_open_at, :time
    add_column :game_instruments, :day3_close_at, :time
    add_column :game_instruments, :day4_open_at, :time
    add_column :game_instruments, :day4_close_at, :time
    add_column :game_instruments, :day5_open_at, :time
    add_column :game_instruments, :day5_close_at, :time
    add_column :game_instruments, :day6_open_at, :time
    add_column :game_instruments, :day6_close_at, :time
    add_column :game_instruments, :day7_open_at, :time
    add_column :game_instruments, :day7_close_at, :time

    # game 1: byte1: 5min
    # game 2: byte2: 30, byte3: 60, byte4: 2min, byte5: 5min
    add_column :game_instruments, :disabled_game_period, :string, null: false, default: '111111'

  end
end

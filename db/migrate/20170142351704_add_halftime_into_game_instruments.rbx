class AddHalftimeIntoGameInstruments < ActiveRecord::Migration[5.0]
  def change
    add_column :game_instruments, :day1_halftime_start_at, :time
    add_column :game_instruments, :day1_halftime_end_at, :time
    add_column :game_instruments, :day2_halftime_start_at, :time
    add_column :game_instruments, :day2_halftime_end_at, :time
    add_column :game_instruments, :day3_halftime_start_at, :time
    add_column :game_instruments, :day3_halftime_end_at, :time
    add_column :game_instruments, :day4_halftime_start_at, :time
    add_column :game_instruments, :day4_halftime_end_at, :time
    add_column :game_instruments, :day5_halftime_start_at, :time
    add_column :game_instruments, :day5_halftime_end_at, :time
    add_column :game_instruments, :day6_halftime_start_at, :time
    add_column :game_instruments, :day6_halftime_end_at, :time
    add_column :game_instruments, :day7_halftime_start_at, :time
    add_column :game_instruments, :day7_halftime_end_at, :time

  end
end

class RenameInstruments < ActiveRecord::Migration[5.0]
  def change

    add_column :instruments, :category_id, :integer, null: false, default: 0
    add_column :instruments, :hot, :bool, null: false, default: false

    rename_table :instruments, :game_instruments

  end
end

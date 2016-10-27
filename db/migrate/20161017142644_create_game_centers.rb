class CreateGameCenters < ActiveRecord::Migration[5.0]
  def change
    create_table :game_centers do |t|
      t.boolean :is_master, default: false #
      t.string :name
      t.text :description
      t.timestamps
    end
    add_index :game_centers, :name, unique: true


    #转账记录，每一条成功的转账记录，对应两条 store_credits
    create_table :transfers do |t|
      t.references :user, foreign_key: true
      t.references :from_game_center, foreign_key: true # from game_center
      t.references :to_game_center, foreign_key: true   # to game_centers
      t.string :number
      t.decimal :amount, null: false, default: 0
      t.string :machine_state, limit: 12
      t.timestamps null: false
    end

  end
end

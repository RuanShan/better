class CreateGameCenters < ActiveRecord::Migration[5.0]
  def change
    create_table :game_centers do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
    add_index :game_centers, :name, unique: true


    #转账记录，每一条成功的转账记录，对应两条 store_credits
    create_table :transfer do |t|
      t.references :user
      t.references :from_center # from game_center
      t.references :to_center   # to game_centers
      t.decimal :amount
      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end

  end
end

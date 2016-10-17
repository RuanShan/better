class CreateGameCenters < ActiveRecord::Migration[5.0]
  def change
    create_table :game_centers do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
    add_index :game_centers, :name, unique: true
  end
end

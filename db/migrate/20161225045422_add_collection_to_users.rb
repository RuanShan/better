class AddCollectionToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :collection, :string, null: false, default: ""
  end
end

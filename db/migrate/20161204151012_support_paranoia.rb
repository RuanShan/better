class SupportParanoia < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :deleted_at, :datetime
    add_index :users, :deleted_at
    add_index :users, [:deleted_at, :type]
    #add_column :deposits, :deleted_at, :datetime
    #add_index :deposits, :deleted_at
  end
end

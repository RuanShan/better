#用户站内钱包
class CreateStoreCredits < ActiveRecord::Migration
  def change
    create_table :store_credits do |t|
      t.references :user
      t.references :game_center # 0 即中心钱包
      t.decimal :amount, precision: 8, scale: 2, default: 0.0, null: false
      t.text :memo
      t.datetime :deleted_at
      t.string :currency
      t.integer :originator_id
      t.string :originator_type
      t.timestamps null: false
    end

    add_index :store_credits, :deleted_at
    add_index :store_credits, :user_id
    add_index :store_credits, [:user_id, :game_center_id]
    add_index :store_credits, [:originator_id, :originator_type], name: :store_credits_originator
  end
end

#用户站内钱包
class CreateStoreCredits < ActiveRecord::Migration
  def change
    # 每一条转账记录对应两条 store_credits
    create_table :store_credits do |t|
      t.references :user
      t.decimal :amount, precision: 8, scale: 2, default: 0.0, null: false
      t.string :memo
      t.datetime :deleted_at
      t.integer :originator_id
      t.string :originator_type
      t.timestamps null: false
    end

    add_index :store_credits, :deleted_at
    add_index :store_credits, :user_id
    add_index :store_credits, [:originator_id, :originator_type], name: :store_credits_originator
  end
end

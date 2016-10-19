class CreatePromotions < ActiveRecord::Migration[5.0]
  def change
    create_table :promotions do |t|
      t.string :name
      t.string :description
      t.string :code    # 促销码
      t.integer :rule, null: false, default: 0   # 促销活动的规则， 0. 充值满factor1，送factor2
      t.integer :factor1 #
      t.integer :factor2 #
      t.timestamps
    end
    add_index :promotions, :name, unique: true
  end
end

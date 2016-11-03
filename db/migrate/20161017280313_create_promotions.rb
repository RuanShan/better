class CreatePromotions < ActiveRecord::Migration[5.0]
  def change
    create_table :promotions do |t|
      t.string :name
      t.string :description
      t.string :number    # 促销码
      t.integer :rule, null: false, default: 0
      # 促销活动的规则， 0. 充值满factor1，送factor2
      t.decimal :factor1, null:false, default:0 #
      t.decimal :factor2, null:false, default:0  #
      t.decimal :factor3, null:false, default:0  #
      t.timestamps
    end
    add_index :promotions, :name, unique: true
  end
end

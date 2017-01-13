class CreateGames < ActiveRecord::Migration[5.0]
  def change

    # 投注记录
    create_table :bids do |t|
      # comment out "foreign_key" for mysql (errno: 150 "Foreign key constraint is incorrectly formed"
      t.references :game_round  #, foreign_key: true
      t.references :user        #, foreign_key: true
      t.string :number  #serial number
      t.decimal :amount  # 投注价格
      t.decimal :rate    # 倍率

      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end

    #add_column :users, :deposit_counter, :decimal # 记录用户存款额
    #add_column :users, :drawing_counter, :decimal # 记录用户提款额
    #add_column :bids, :bid_counter, :decimal      # 记录用户投注额


    # 游戏定义
    create_table :games do |t|
      t.integer :game_center_id, null: false, default: 0
      t.string :slug, uniq:true
      t.string :name
      t.text :description
      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end

    create_table :game_rounds do |t|
      t.references :game, foreign_key: true
      t.decimal :paramd1
      t.decimal :paramd2
      t.decimal :paramd3
      t.decimal :paramd4
      t.decimal :paramd5
      t.decimal :paramd6
      t.decimal :paramd7
      t.decimal :paramd8
      t.decimal :paramd9
      t.decimal :paramd10
      t.decimal :paramd11
      t.decimal :paramd12
      t.timestamps null: false
    end

  end
end

class CreateGames < ActiveRecord::Migration[5.0]
  def change

    # 投注记录
    create_table :bids do |t|
      t.references :game_round, foreign_key: true
      t.references :user, foreign_key: true

      t.decimal :amount  # 投注价格
      t.decimal :rate    # 倍率

      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end



    # 游戏定义
    create_table :games do |t|
      t.references :game_center, foreign_key: true
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

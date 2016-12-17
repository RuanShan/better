class SupportTrade < ActiveRecord::Migration[5.0]
  def change
    #汇率，股票，指数等
    create_table :instruments do |t|
    #  t.references :game_round, foreign_key: true
    #  t.references :user, foreign_key: true
      t.string :name  #serial number
      t.string :code
      t.string :description

      t.timestamps null: false
    end

    #
    add_reference :game_rounds, :instrument
    add_column :game_rounds, :instrument_code, :string
    add_column :game_rounds, :start_at, :datetime
    #游戏持续的秒数
    add_column :game_rounds, :period, :integer, null: false, default: 0
    add_column :bids, :highlow, :integer, null: false, default: 0
    # 投注时的点位
    add_column :bids, :last_quote, :decimal
    # 投注记录
    #create_table :bids do |t|
    #  t.references :game_round, foreign_key: true
    #  t.references :user, foreign_key: true
    #  t.string :number  #serial number
    #  t.decimal :amount  # 投注价格
    #  t.decimal :rate    # 倍率
    #  t.integer :state, null: false, default: 0
    #  t.timestamps null: false
    #end

    #add_column :users, :deposit_counter, :decimal # 记录用户存款额
    #add_column :users, :drawing_counter, :decimal # 记录用户提款额
    #add_column :bids, :bid_counter, :decimal      # 记录用户投注额


    # 游戏定义
    #create_table :games do |t|
    #  t.integer :game_center_id, null: false, default: 0
    #  t.string :slug, uniq:true
    #  t.string :name
    #  t.text :description
    #  t.integer :state, null: false, default: 0
    #  t.timestamps null: false
    #end
    # game has_many_belongs_to instrument
     add_column :games, :rule, :integer, null:false, default: 0


  end
end

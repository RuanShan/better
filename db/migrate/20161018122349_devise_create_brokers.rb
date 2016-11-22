class DeviseCreateBrokers < ActiveRecord::Migration[5.0]
  def change
    create_table :sale_days do |t|
      t.references :seller, polymorphic: true
      t.date :effective_on
      t.integer :clink_visits, default: 0, null: false  #客户推广链接点击数
      t.integer :blink_visits, default: 0, null: false  #下级代理推广链接点击数
      t.integer :member_count, default: 0, null: false  # 日注册人数
      t.integer :valuable_member_count, default: 0, null: false #新注册并存款
      t.integer :energetic_member_count, default: 0, null: false
      #活跃用户, 这个是累计的，表示到现在这个时间，本月达到活跃指标的人数
      t.timestamps null: false
      t.index [:saler_id, :effective_on]
    end

    #每一天结束时计划任务更新
    create_table :sale_months do |t|
      t.references :seller, polymorphic: true
      t.date :effective_on
      t.integer :clink_visits, default: 0, null: false    #客户推广链接点击数
      t.integer :blink_visits, default: 0, null: false    #下级代理推广链接点击数
      t.integer :member_count, default: 0, null: false  # 日注册人数
      t.integer :valuable_member_count, default: 0, null: false #新注册并存款
      t.integer :energetic_member_count, default: 0, null: false #活跃用户
      t.timestamps null: false
      t.index [:saler_id, :effective_on]
    end

    #实时统计每一天
    create_table :user_days do |t|
      t.references :user
      t.references :broker # 便于查询 代理的日统计
      t.date :effective_on
      t.decimal :deposit_amount, default: 0, null: false  # 日存款额
      t.decimal :drawing_amount, default: 0, null: false  # 日提款额
      t.decimal :bid_amount, default: 0, null: false      # 日流水额
      t.decimal :bonus, default: 0, null: false    # 日红利额
      t.decimal :profit, default: 0, null: false          # 游戏收益
      t.decimal :balance, default: 0, null: false         # 账户余额(累计)
      t.decimal :bank_charges, default: 0, null: false
      t.decimal :platform_charges, default: 0, null: false
      #输赢补差， 投注补差
      #t.integer :regists, default: 0, null: false #注册数 	新注册并存款
      t.timestamps null: false

      t.index [:user_id, :effective_on]
      t.index [:user_id, :broker_id, :effective_on]
    end

    #每一天结束时计划任务更新
    create_table :user_months do |t|
      t.references :user
      t.references :broker # 便于查询 代理的日统计
      t.date :effective_on  # 每个月的1号
      t.decimal :deposit_amount, default: 0, null: false  # 月存款额
      t.decimal :drawing_amount, default: 0, null: false  # 月提款额
      t.decimal :bid_amount, default: 0, null: false      # 月流水额
      t.decimal :bonus, default: 0, null: false    # 月红利额
      t.decimal :profit, default: 0, null: false          # 月游戏收益
      t.decimal :balance, default: 0, null: false         # 账户余额(累计)
      t.decimal :bank_charges, default: 0, null: false
      t.decimal :platform_charges, default: 0, null: false
      t.timestamps null: false
      t.index [:user_id, :effective_on]
      t.index [:user_id, :broker_id, :effective_on]
    end

    #每一天结束时计划任务更新
    #统计用户全部的 存款 提款 	红利 	投注 	输赢 	派奖
    create_table :user_lives do |t|
      t.references :user
      t.references :broker # 便于查询 代理的日统计
      t.date :effective_on # 最后统计日期
      t.decimal :deposit_amount, default: 0, null: false  # 存款额
      t.decimal :drawing_amount, default: 0, null: false  # 提款额
      t.decimal :bonus, default: 0, null: false    # 红利额
      t.decimal :bid_amount, default: 0, null: false      # 流水额
      t.decimal :profit, default: 0, null: false          # 游戏收益
      t.decimal :balance, default: 0, null: false         # 账户余额(累计)
      #输赢补差， 投注补差
      #t.integer :regists, default: 0, null: false #注册数 	新注册并存款
      t.timestamps null: false

      t.index [:user_id, :effective_on]
      t.index [:user_id, :broker_id, :effective_on]
    end

  end
end

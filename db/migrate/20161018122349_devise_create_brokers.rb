class DeviseCreateBrokers < ActiveRecord::Migration[5.0]
  def change
    create_table :brokers do |t|
      ## awesome_nested_set
      t.integer :parent_id, :null => true, :index => true
      t.integer :lft, :null => false, :index => true
      t.integer :rgt, :null => false, :index => true
      # optional fields
      t.integer :depth, :null => false, :default => 0
      t.integer :children_count, :null => false, :default => 0


      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      # Lockable
      t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      t.string   :unlock_token # Only if unlock strategy is :email or :both
      t.datetime :locked_at

      t.string :nickname
      t.string :number, null: false, index: true
      t.timestamps null: false
    end

    add_index :brokers, :email,                unique: true
    add_index :brokers, :reset_password_token, unique: true
    # add_index :brokers, :confirmation_token,   unique: true
    add_index :brokers, :unlock_token,         unique: true
    add_column :users, :broker_id, :integer, default: 0, null: false, index:true
    add_index :users, [:broker_id, :created_at]

    create_table :broker_days do |t|
      t.references :broker
      t.date :effective_on
      t.integer :clink_visits, default: 0, null: false  #客户推广链接点击数
      t.integer :blink_visits, default: 0, null: false  #下级代理推广链接点击数
      t.integer :user_counter, default: 0, null: false  # 日注册人数
      t.integer :valued_user_counter, default: 0, null: false #新注册并存款
      t.integer :energetic_user_counter, default: 0, null: false #活跃用户

      t.timestamps null: false
    end

    create_table :broker_months do |t|
      t.references :broker
      t.integer :clink_visits, default: 0, null: false    #客户推广链接点击数
      t.integer :blink_visits, default: 0, null: false    #下级代理推广链接点击数
      t.integer :user_counter, default: 0, null: false  # 日注册人数
      t.integer :valued_user_counter, default: 0, null: false #新注册并存款
      t.integer :energetic_user_counter, default: 0, null: false #活跃用户
      t.timestamps null: false
    end

    create_table :user_days do |t|
      t.references :user
      t.date :effective_on
      t.decimal :deposit_amount, default: 0, null: false  # 日存款额
      t.decimal :drawing_amount, default: 0, null: false  # 日提款额
      t.decimal :bid_amount, default: 0, null: false      # 日流水额
      t.decimal :bonus_amount, default: 0, null: false    # 日红利额
      #输赢补差， 投注补差
      #t.integer :regists, default: 0, null: false #注册数 	新注册并存款
      t.timestamps null: false
    end

    create_table :user_months do |t|
      t.references :user
      t.date :effective_on
      t.decimal :deposit_amount, default: 0, null: false  # 月存款额
      t.decimal :drawing_amount, default: 0, null: false  # 月提款额
      t.decimal :bid_amount, default: 0, null: false      # 月流水额
      t.decimal :bonus_amount, default: 0, null: false    # 月红利额
      t.timestamps null: false
    end

  end
end

class CreatePayments < ActiveRecord::Migration[5.0]
  def change
    # this is STI 
    create_table :payment_methods do |t|
      t.string :type
      #t.references :user
      t.string :name
      t.string :merchant
      t.string :pid, null: false, default: ''
      t.string :key, null: false, default: ''
      t.string :payee_name    #转账 收款方户名
      t.string :payee_address #转账 收款方地址
      t.string :payee_account #转账 收款方账号

      t.integer :state, null: false, default: 0
      t.boolean :enabled, null:false, default: false
      t.timestamps null: false
    end

    #充值记录, 记录金钱交易，每一条成功的充值记录，对应一条 store_credits
    create_table :deposits do |t|
      t.references :payment_method, foreign_key: true
      t.references :user, foreign_key: true
      t.string :number  #serial number
      t.string :currency
      t.decimal :amount
      t.integer :state, null: false, default: 0
      t.string :memo
      t.timestamps null: false
    end
    add_index :deposits, [:number], unique: true

    create_table :user_banks do |t|
      t.references :user, foreign_key: true
      t.string :name
      t.string :code
      t.integer :country_id, default: 1
      t.integer :province_id, default: 2
      t.integer :city_id, default: 2
      t.string :address, null:false, default: false
      t.timestamps null: false
    end

    #提款记录, 每一条成功的提款记录，对应一条 store_credits
    create_table :drawings do |t|
      t.references :user_bank
      t.string :number  #serial number
      t.decimal :amount
      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end

    create_table :messages do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.references :user
      t.integer :state
      t.timestamps null: false
    end

    create_table :user_messages do |t|
      t.references :user
      t.references :message
      t.integer :state, null:false, default:0
      t.timestamps null: false
    end

    create_table :exchange_rates do |t|
      t.decimal :withdraw_rate, null: false, default: 1.0
      t.decimal :deposit_rate, null: false, default: 1.0
      t.decimal :withdraw_factor, null: false, default: 1.0
      t.decimal :deposit_factor, null: false, default: 1.0
      t.string :params, null:false, default: ''
      t.timestamps null: false
    end
  end
end

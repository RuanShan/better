class CreatePayments < ActiveRecord::Migration[5.0]
  def change

    create_table :payment_methods do |t|
      t.references :user
      t.string :name
      t.string :merchant
      t.string :secret, null: false, default: ''
      t.string :code, null: false, default: ''
      t.integer :state, null: false, default: 0
      t.boolean :enabled, null:false, default: false
      t.timestamps null: false
    end

    create_table :payments do |t|
      t.references :user
      t.string :transfer_from
      t.string :transfer_to
      t.decimal :amount
      t.integer :state, null: false, default: 0
      t.timestamps null: false
    end

    create_table :user_banks do |t|
      t.references :user
      t.string :name
      t.string :code
      t.integer :country_id, default: 1
      t.integer :province_id, default: 2
      t.integer :city_id, default: 2
      t.string :address, null:false, default: false
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
      t.string :code
      t.integer :country_id, default: 1
      t.integer :province_id, default: 2
      t.integer :city_id, default: 2
      t.string :address, null:false, default: ''
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

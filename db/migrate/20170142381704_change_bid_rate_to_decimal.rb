class ChangeBidRateToDecimal < ActiveRecord::Migration[5.0]
  def change
    change_column :bids, :rate, :decimal, scale: 4, precision: 10,  null: false, default: 0.7
  end
end

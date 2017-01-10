class ChangeBidQuoteToDecimal < ActiveRecord::Migration[5.0]
  def change
    change_column :bids, :last_quote, :decimal, scale: 6, precision: 14,  null: false, default: 0.0
  end
end

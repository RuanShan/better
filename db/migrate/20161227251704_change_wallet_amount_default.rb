class ChangeWalletAmountDefault < ActiveRecord::Migration[5.0]
  def change
    change_column_default(:wallets, :amount, 0)
  end
end

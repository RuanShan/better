class AddBankCodeToDeposits < ActiveRecord::Migration[5.0]
  def change
    # it is only for payment_method_id: 1
    add_column :deposits, :iss_ins_cd, :string, null: false, default: ''
  end
end

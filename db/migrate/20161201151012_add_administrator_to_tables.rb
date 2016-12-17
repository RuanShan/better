class AddAdministratorToTables < ActiveRecord::Migration[5.0]
  def change
    add_reference :drawings, :administrator, foreign_key: true
    add_reference :deposits, :administrator, foreign_key: true
    add_reference :users, :administrator, foreign_key: true
    add_reference :promotions, :administrator, foreign_key: true
  end
end

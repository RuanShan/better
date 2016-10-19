class CreateSettings < ActiveRecord::Migration

  def self.up
    create_table :settings do |t|
      t.string :site_name
      t.string :company_name
      t.string :contact_email
      t.timestamps null: false
    end
  end

  def self.down
    drop_table :settings
  end
end

class AddAttachmentAvatarIdFrontIdBackToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.attachment :avatar
      t.attachment :id_front
      t.attachment :id_back
    end
  end

  def self.down
    remove_attachment :users, :avatar
    remove_attachment :users, :id_front
    remove_attachment :users, :id_back
  end
end

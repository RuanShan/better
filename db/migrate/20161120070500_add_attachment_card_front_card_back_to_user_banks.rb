class AddAttachmentCardFrontCardBackToUserBanks < ActiveRecord::Migration
  def self.up
    change_table :user_banks do |t|
      t.attachment :card_front
      t.attachment :card_back
    end
  end

  def self.down
    remove_attachment :user_banks, :card_front
    remove_attachment :user_banks, :card_back
  end
end

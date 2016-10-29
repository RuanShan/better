require 'rails_helper'

RSpec.describe UserMessage, type: :model do
  let!( :admin ) { create :administrator }
  let!( :user ) { create :user }
  let!( :system_messages ){ create_list(:system_message, 20, administrator: admin) }

  context "has 20 system messages" do
    before(:each){  system_messages.each{|sm|sm.save!} }

    let( :first_message ) { system_messages[0] }
    it "user can read one message" do
      user.read_message(first_message.id)
      user_message = UserMessage.where(:user_id=>user.id, :message_id=>first_message.id).all
      expect( user_message.size ).to eq 1
      expect( user_message[0].state).to eq "read"
    end

    it "user can read all messages" do
      user.read_messages
      user_messages = UserMessage.where(:user_id=>user.id, :message_id=>system_messages.pluck(:id)).all
      expect( user_messages.size ).to eq 20
      user_messages.each{|user_message| expect( user_message.state).to eq "read"}
    end

    it "user can delete one unread message" do
      user.delete_message(first_message.id)
      user_message = UserMessage.where(:user_id=>user.id, :message_id=>first_message.id).all
      expect( user_message.size ).to eq 1
      expect( user_message[0].state).to eq "deleted"
    end

    it "user can delete one red message" do
      user.read_message(first_message.id)
      user.delete_message(first_message.id)
      user_message = UserMessage.where(:user_id=>user.id, :message_id=>first_message.id).all
      expect( user_message.size ).to eq 1
      expect( user_message[0].state).to eq "deleted"
    end

  end

end

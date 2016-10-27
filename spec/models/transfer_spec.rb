require 'rails_helper'

RSpec.describe Transfer, type: :model do


  let!( :transfer)  { create :transfer_with_game_centers}



  it "has initial machine state pending" do
    transfer = Transfer.new
    expect(transfer.pending?).to be_truthy
  end

  it "transfer process successfully" do
    transfer.process
    expect(transfer.success?).to be_truthy
    #update user wallets
    expect(transfer.wallets.size).to eq 2
  end

end

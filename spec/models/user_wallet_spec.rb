require 'rails_helper'

RSpec.describe Wallet, type: :model do
  let!( :user ) { create :user }
  let( :deposit_50 ){ build :deposit, amount: 50, user: user }

  it "has 50 after deposit 50" do
    deposit_50.save!
    deposit_50.process
    expect( user.wallet_balance).to eq 50
  end

  context "has 1000 in wallet" do
    before(:each){  create :wallet, amount: 1000, user: user }

    let( :user_bank ) { build :user_bank, user: user }
    let( :drawing_50 ){ build :drawing, user_bank: user_bank, amount: 50 }
    it "drawing 50 successfully" do
      drawing_50.save!
      expect( drawing_50.pending? ).to be_truthy
      drawing_50.process
      expect( user.wallet_balance).to eq 1000-50
    end
  end
  
end

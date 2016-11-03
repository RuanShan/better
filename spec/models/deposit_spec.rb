require 'rails_helper'

RSpec.describe Deposit, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"

  let!( :user ) { create :user }
  let!( :payment_method ) { create :payment_method }

  context "has 0 in wallet" do
    let( :deposit_10000 ){ build :deposit, amount: 10000, user: user, payment_method: payment_method }
    let( :deposit_10 ){ build :deposit, amount: 10, user: user, payment_method: payment_method }
    let( :deposit_100000 ){ build :deposit, amount: 100000, user: user, payment_method: payment_method }

    it "deposit between 50 and 50,000 one time" do
      deposit_10000.save
      expect( deposit_10000.errors.size).to eq 0
      deposit_10000.process
      expect( user.wallet_balance).to eq 10000
      deposit_10.save
      expect( deposit_10.errors.size).to eq 1
      deposit_10.process
      expect( user.wallet_balance).to eq 10000
      deposit_100000.save
      expect( deposit_100000.errors.size).to eq 1
      deposit_100000.process
      expect( user.wallet_balance).to eq 10000
    end

    context "deposit with promotion code, rule 1" do
      before(:each){create :promotion, code:"123456"}
      let( :deposit_10000_invalid_pcode ){ build :deposit, promotion_number:'654321', amount: 10000, user: user, payment_method: payment_method }
      let( :deposit_10000_valid_pcode ){ build :deposit, promotion_number:'123456', amount: 10000, user: user, payment_method: payment_method }

      it "promotion code in valid" do
        deposit_10000_invalid_pcode.do_with_promotion
        expect( deposit_10000_invalid_pcode.errors.size).to eq 1
        deposit_10000_invalid_pcode.process
        expect( user.wallet_balance).to eq 0
      end

      it "promotion code valid for rule 1" do
       deposit_10000_valid_pcode.do_with_promotion
       expect( deposit_10000_valid_pcode.errors.size).to eq 0
       deposit_10000_valid_pcode.process
       expect( user.wallet_balance).to eq 10010
      end
    end

  end
end

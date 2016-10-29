require 'rails_helper'

RSpec.describe Drawing, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"
  let!( :user ) { create :user }
  let!( :user_bank ) { create :user_bank, user: user }

  context "has 500,000 in wallet" do
    before(:each){  create :wallet, amount: 500000, user: user }

    let( :drawing_10000 ){ build :drawing, amount: 10000, user_bank: user_bank }
    let( :drawing_10 ){ build :drawing, amount: 10, user_bank: user_bank }
    let( :drawing_100000 ){ build :drawing, amount: 100000, user_bank: user_bank }

    it "drawing between 50 and 50,000 one time" do
      drawing_10000.save
      expect( drawing_10000.errors.size).to eq 0
      drawing_10000.process
      expect( user.wallet_balance).to eq 490000
      drawing_10.save
      expect( drawing_10.errors.size).to eq 1
      drawing_10.process
      expect( user.wallet_balance).to eq 490000
      drawing_100000.save
      expect( drawing_100000.errors.size).to eq 1
      drawing_100000.process
      expect( user.wallet_balance).to eq 490000
    end

    context "has 50 drawings today" do
      let(:drawings_50times){create_list :drawing, 50, amount: 100, user_bank: user_bank}

      it "drawing should not be greater than 50 times" do
        drawings_50times.each{|d| d.process;d.save!}
        expect( user.drawings_count_today).to eq 50
        drawing_10000.save
        expect( drawing_10000.errors.size).to eq 1
        drawing_10000.process
        expect( user.wallet_balance).to eq 495000
      end
    end

    context "drawing nearly 200000 today" do
      let(:drawings_4times){create_list :drawing, 4, amount: 49000, user_bank: user_bank}

      it "drawing should not over 200,000 one day" do
        drawings_4times.each{|d| d.process;d.save!}
        expect( user.drawings_sum_today).to eq 196000
        drawing_10000.save
        expect( drawing_10000.errors.size).to eq 1
        drawing_10000.process
        expect( user.wallet_balance).to eq 304000
      end
    end

  end

  context "has 1,000 in wallet" do
    before(:each){  create :wallet, amount: 1000, user: user }

    let( :drawing_10000 ){ build :drawing, amount: 10000, user_bank: user_bank }

    it "should not drawing more than wallent blance" do
      drawing_10000.save
      expect( drawing_10000.errors.size).to eq 1
      drawing_10000.process
      expect( user.wallet_balance).to eq 1000
    end
  end

end

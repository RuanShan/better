require 'rails_helper'

RSpec.describe DayUpdater, type: :model do
  let(:broker) { create :broker }
  let(:user) { create :user, broker: broker}
  let(:wallet) { build :wallet, amount: 100, user: user }

  it "add user day after deposit 100 " do
    expect { wallet.save!}.to change { UserDay.count }.by( 1 )
  end

  it "user day balance increase 100 after deposit 100 " do
    saved_wallet =  create( :wallet, amount: 100, user: user )
    day = saved_wallet.user.user_today
    expect( day.deposit_amount ).to eq( 100 )
    expect( day.balance).to eq( 100 )
  end

  it "broker day after deposit 100 " do
    expect { wallet.save!}.to change { SaleDay.count }.by( 1 )
  end

  it "broker energetic_member_count +1 after deposit 100 " do
    saved_wallet =  create( :wallet, amount: 100, user: user )
    day = saved_wallet.user.broker.sale_today

    expect( day.valuable_member_count).to eq( 1 )
  end

end

describe MaintainUserMonth do
  let( :broker ) { create :broker  }
  let( :user ) { create :user  }
  let( :deposit ) { create :deposit, amount: 1000, user: user }

  it "add user month for one user" do
    user
    expect { MaintainUserMonth.new.run }.to change { UserMonth.count}.by(1)
  end

  it "add user months for two users" do
    @user1 = create :user
    @user2 = create :user
    expect { MaintainUserMonth.new.run }.to change { UserMonth.count}.by(2)
  end


  context " user with deposit" do
    before(:each) {
      @deposit_100 =  create( :deposit, amount: 100, user: user);
      @deposit_100.process!
    }

    it "should has month.deposit_amount 100 after deposit 100" do
      date = DateTime.current.to_date
      MaintainUserMonth.new( date ).run
      month = @deposit_100.user.user_month.reload # 需重新加载
      expect( month.deposit_amount ).to eq( 100 )
    end

  end
end

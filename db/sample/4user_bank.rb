@user_bank=FactoryGirl.create(:user_bank, user: @user, card_number:rand(9999999999999999), skip_validate_bank: true)

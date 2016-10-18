payment_method = FactoryGirl.create(:payment_method)

FactoryGirl.create(:deposit, payment_method: payment_method, user: @user)

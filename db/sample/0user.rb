@broker = FactoryGirl.create(:broker, email: 'broker@example.com')

@user = FactoryGirl.create(:user, email: 'test@example.com', broker: @broker)

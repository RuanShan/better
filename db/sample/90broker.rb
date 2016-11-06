
@brokers = FactoryGirl.create_list(:broker, 20, parent_id: @broker.id)
#puts "create 20 brokers "
@broker_users = []
@brokers.each{|broker|
  @broker_users << FactoryGirl.create(:user, email: "test#{broker.id}@example.com", broker: broker)
}
#puts "create users for 20 brokers "

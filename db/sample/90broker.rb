
@brokers = FactoryGirl.create_list(:broker, 20, parent_id: @broker.id)
#puts "create 20 brokers "
@broker_users = []
@brokers.each{|broker|
  @broker_users << FactoryGirl.create(:user, email: "test#{broker.id}@example.com", broker: @broker)
}

FactoryGirl.create :broker_7level_tree, parent: @broker, current_depth:1

#puts "create users for 20 brokers "

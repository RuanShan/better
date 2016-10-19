20.times do |i|
  FactoryGirl.create(:message, :title => "Welcome#{i}")
end

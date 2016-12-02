
puts "create broker months for broker:#{@broker.id}-#{@broker.real_name}"
(6..12).each do |month|
  effective_on = "2016-#{month}-1"
  clink_visits = rand(0..200)
  blink_visits = rand(0..200)
  member_count = rand(0..clink_visits)
  valuable_member_count = rand(0..member_count)
  energetic_member_count = rand(0..valuable_member_count)
  puts "create broker months effective_on:#{effective_on} "
  FactoryGirl.create(:sale_month, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
    member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, user: @broker)
end

FactoryGirl.create(:sale_month, broker: @broker)
@brokers.each{|broker|
  (6..12).each do |month|
    effective_on = "2016-#{month}-1"
    clink_visits = rand(0..200)
    blink_visits = rand(0..200)
    member_count = rand(0..clink_visits)
    valuable_member_count = rand(0..member_count)
    energetic_member_count = rand(0..valuable_member_count)
    puts "create broker months effective_on:#{effective_on} "
    FactoryGirl.create(:sale_month, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
      member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, user: broker)
  end
}

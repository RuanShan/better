=begin
puts "create broker months for broker:#{@broker.id}-#{@broker.name}"
(6..12).each do |month|
  effective_on = "2016-#{month}-1"
  clink_visits = rand(99)
  blink_visits = rand(99)
  member_count = rand(9)
  valuable_member_count = rand(0..member_count)
  energetic_member_count = rand(0..valuable_member_count)
  puts "create broker months effective_on:#{effective_on} "
  FactoryGirl.create(:broker_month, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
    member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, broker: @broker)
end

FactoryGirl.create(:broker_month, broker: @broker)
@brokers.each{|broker|
  (6..12).each do |month|
    effective_on = "2016-#{month}-1"
    clink_visits = rand(99)
    blink_visits = rand(99)
    member_count = rand(9)
    valuable_member_count = rand(0..member_count)
    energetic_member_count = rand(0..valuable_member_count)
    puts "create broker months effective_on:#{effective_on} "
    FactoryGirl.create(:broker_month, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
      member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, broker: broker)
  end
}
=end


puts "create broker days for broker:#{@broker.id}-#{@broker.real_name}"
(1..12).each do |month|
  (1..10).each do |day|
    day = month == 2 ? rand(1..28) : rand(1..30)
    effective_on = "2016-#{month}-#{day}"
    clink_visits = rand(0..70)
    blink_visits = rand(0..70)
    member_count = rand(0..clink_visits)
    valuable_member_count = rand(0..member_count)
    energetic_member_count = rand(0..valuable_member_count)
    puts "create broker days effective_on:#{effective_on} "
    FactoryGirl.create(:sale_day, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
      member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, user: @broker)
  end
end

@brokers.each{|broker|
  (1..12).each do |month|
    (1..10).each do |day|
      day = month == 2 ? rand(1..28) : rand(1..30)
      effective_on = "2016-#{month}-#{day}"
      clink_visits = rand(0..70)
      blink_visits = rand(0..70)
      member_count = rand(0..clink_visits)
      valuable_member_count = rand(0..member_count)
      energetic_member_count = rand(0..valuable_member_count)
      puts "create broker days effective_on:#{effective_on} "
      FactoryGirl.create(:sale_day, effective_on: effective_on, clink_visits: clink_visits, blink_visits: blink_visits,
        member_count: member_count, valuable_member_count: valuable_member_count, energetic_member_count: energetic_member_count, user: broker)
    end
  end
 }

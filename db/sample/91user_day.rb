=begin
puts "create user days for user:#{@user.id}-#{@user.name}"
(6..10).each do |month|
  (1..10).each do |day|
    day = rand(1..30)
    effective_on = "2016-#{month}-#{day}"
    deposit_amount = rand(50..50000)
    drawing_amount = rand(50..50000)
    bid_amount = rand(50..50000)
    bonus = rand(0..100000)
    bank_charges = drawing_amount*0.01
    platform_charges = bid_amount*0.1
    puts "create user days effective_on:#{effective_on} "
    FactoryGirl.create(:user_day, effective_on: effective_on, deposit_amount: deposit_amount, drawing_amount: drawing_amount,
      bid_amount: bid_amount, bonus: bonus, bank_charges: bank_charges, platform_charges: platform_charges, user: @user, broker: @user.broker)
  end
end

@broker_users.each{|broker_user|
  puts "create user days for user:#{broker_user.id}-#{broker_user.name}"
  (6..10).each do |month|
    (1..10).each do |day|
      day = rand(1..30)
      effective_on = "2016-#{month}-#{day}"
      deposit_amount = rand(50..50000)
      drawing_amount = rand(50..50000)
      bid_amount = rand(50..50000)
      bonus = rand(0..100000)
      bank_charges = drawing_amount*0.01
      platform_charges = bid_amount*0.1
      puts "create user days effective_on:#{effective_on} "
      FactoryGirl.create(:user_day, effective_on: effective_on, deposit_amount: deposit_amount, drawing_amount: drawing_amount,
        bid_amount: bid_amount, bonus: bonus, bank_charges: bank_charges, platform_charges: platform_charges, user: broker_user, broker: broker_user.broker)
    end
  end

}
=end

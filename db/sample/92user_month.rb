=begin
puts "create user months for user:#{@user.id}-#{@user.name}"
(6..10).each do |month|
  day = rand(1..30)
  effective_on = "2016-#{month}-1"
  deposit_amount = rand(50..50000)
  drawing_amount = rand(50..50000)
  bid_amount = rand(50..50000)
  bonus = rand(0..100000)
  profit = rand(0..100000)
  balance = rand(0..100000)
  bank_charges = drawing_amount*0.01
  platform_charges = bid_amount*0.1
  puts "create user months effective_on:#{effective_on} "
  FactoryGirl.create(:user_month, effective_on: effective_on, deposit_amount: deposit_amount, drawing_amount: drawing_amount,
    bid_amount: bid_amount, bonus: bonus, profit: profit, balance: balance, bank_charges: bank_charges,
    platform_charges: platform_charges, user: @user, broker: @user.broker)
end

@broker_users.each{|broker_user|
  puts "create user months for user:#{broker_user.id}-#{broker_user.name}"
  (6..10).each do |month|
    day = rand(1..30)
    effective_on = "2016-#{month}-1"
    deposit_amount = rand(50..50000)
    drawing_amount = rand(50..50000)
    bid_amount = rand(50..50000)
    bonus = rand(0..100000)
    profit = rand(0..100000)
    balance = rand(0..100000)
    bank_charges = drawing_amount*0.01
    platform_charges = bid_amount*0.1
    puts "create user months effective_on:#{effective_on} "
    FactoryGirl.create(:user_month, effective_on: effective_on, deposit_amount: deposit_amount, drawing_amount: drawing_amount,
      bid_amount: bid_amount, bonus: bonus, profit: profit, balance: balance, bank_charges: bank_charges,
      platform_charges: platform_charges, user: broker_user, broker: broker_user.broker)
  end
}
=end

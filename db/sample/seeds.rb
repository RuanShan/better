###################################################################################################################################################################################################################################################################################################################################################################################
#suffix number of seeds file name indicate loading order.
@admin = Administrator.first
User.destroy_all
Deposit.destroy_all
Message.destroy_all
UserBank.destroy_all
Drawing.destroy_all
Game.destroy_all
GameRound.destroy_all
Bid.destroy_all
Broker.destroy_all
#UserDay.destroy_all
#UserMonth.destroy_all
#SaleDay.destroy_all
#SaleMonth.destroy_all

xpath = File.dirname(__FILE__)+ "/*.rb"
Dir[xpath].sort.each {|file|
  next if file=~/seeds.rb/
  puts "loading #{file}"
  load file
}

puts "loading complete!"

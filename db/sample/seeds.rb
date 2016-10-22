###################################################################################################################################################################################################################################################################################################################################################################################
#suffix number of seeds file name indicate loading order.
@admin = Administrator.first
@game_centers = GameCenter.all
User.destroy_all
Message.destroy_all


xpath = File.dirname(__FILE__)+ "/*.rb"
Dir[xpath].sort.each {|file|
  next if file=~/seeds.rb/
  puts "loading #{file}"
  load file
}

puts "loading complete!"

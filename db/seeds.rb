# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
user = CreateAdminService.new.call
puts 'CREATED ADMIN USER: ' << user.email
# Environment variables (ENV['...']) can be set in the file .env file.

[{name: "中心钱包"}, {name: "AG娱乐"},{name: "BD娱乐"},{name: "QQ娱乐"},{name: "MG娱乐"},{name: "BB体育"}].each{|attrs|
  GameCenter.create!( attrs )
}

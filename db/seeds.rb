# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# 加载网站运行用数据，非测试数据，测试数据加载使用 rails better:load_sample
user = CreateAdminService.new.call
puts 'CREATED ADMIN USER: ' << user.email
# Environment variables (ENV['...']) can be set in the file .env file.

#[{name: "中心钱包"}, {name: "AG娱乐"},{name: "BD娱乐"},{name: "QQ娱乐"},{name: "MG娱乐"},{name: "BB体育"}].each_with_index{|attrs,i|
#  GameCenter.create!( attrs )
#}

Gateway::AlipayBank.create!  name: "在线支付", merchant: "支付宝", enabled: true
Gateway::BankTransfer.create!  name: "银行转账", merchant: "汇潮", enabled: true
Gateway::Weixin.create!  name: "微信充值", merchant: "腾讯", enabled: true

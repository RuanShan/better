FactoryGirl.define do
  factory :payment_method do
    name "在线支付"
    merchant "支付宝"
    pid "MyString"
    key "MyString"
    state 1
    enabled false
  end
end

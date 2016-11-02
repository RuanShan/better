FactoryGirl.define do
  factory :broker do
    confirmed_at Time.now
    name "Test Broker"
    sequence(:email) { |n| "broker#{n}@example.com" }
    password "please123"
    lft 0
    rgt 1
  end
end

FactoryGirl.define do
  factory :broker do
    confirmed_at Time.now
    name "Test Broker"
    sequence(:email) { |n| "broker#{n}@example.com" }
    password "please123"
  end
end

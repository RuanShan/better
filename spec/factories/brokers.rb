FactoryGirl.define do
  factory :broker do
    confirmed_at Time.now
    sequence(:name) { |n| "Test Broker#{n}" }
    sequence(:email) { |n| "broker#{n}@example.com" }
    password "please123"
  end
end

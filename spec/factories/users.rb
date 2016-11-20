FactoryGirl.define do
  factory :user do
    type 'User'
    confirmed_at Time.now
    first_name "Test User"
    sequence(:email) { |n| "test#{n}@example.com" }
    password "please123"
    money_password "please123"
    gender 0
    trait :vip do
      role 'vip'
    end

    trait :broker do
      broker
    end

    factory :user_and_broker, traits: [:broker]
  end
end

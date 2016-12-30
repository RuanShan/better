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

    trait :children do
      after(:create) {|object|
        create :user, parent: object
      }
    end

    factory :user_and_broker, traits: [:broker]

    factory :user_and_children , traits: [:children]

  end



end

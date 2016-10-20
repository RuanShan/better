FactoryGirl.define do
  factory :user do
    confirmed_at Time.now
    name "Test User"
    sequence(:email) { |n| "test#{n}@example.com" }
    password "please123"
    money_password "please123"
    gender 0
    trait :admin do
      role 'admin'
    end

  end
end

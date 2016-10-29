FactoryGirl.define do
  factory :administrator do
    email "admin@example.com"
    #sequence(:email) { |n| "admin#{n}@example.com" }
    password "please123"
  end
end

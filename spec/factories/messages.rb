FactoryGirl.define do
  factory :message do
    user_id 1
    sequence(:title) { |n| "this is title #{n}" }
    sequence(:content) { |n| "this is message content #{n}" }

    trait :system do
      state 0
    end
    factory :system_message,   traits: [:system]
  end
end

FactoryGirl.define do
  factory :message do
    administrator_id 0
    sequence(:title) { |n| "this is title #{n}" }
    sequence(:content) { |n| "this is message content #{n}" }

    trait :system do
      message_type 0
    end
    factory :system_message,   traits: [:system]
  end
end

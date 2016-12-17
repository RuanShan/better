FactoryGirl.define do
  factory :wallet do
    user nil
    amount 100
    memo "MyString"

    trait :bonus do
      is_bonus true
    end

    factory :bonus_wallet, traits: [:bonus]
  end
end

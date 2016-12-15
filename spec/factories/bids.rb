FactoryGirl.define do
  factory :bid do
    game_round nil
    user nil
    sequence(:number) { |n| "MyString#{n}" }
    amount "9.99"
    rate "9.99"
    state 1
    last_quote 99999
  end
end

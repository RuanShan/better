FactoryGirl.define do
  factory :transfer do
    user nil
    from_game_center nil
    to_game_center ""
    sequence(:number) { |n| "MyString#{n}" }
    amount "9.99"
    state 1
  end
end

FactoryGirl.define do
  factory :transfer do
    user nil
    sequence(:number) { |n| "MyString#{n}" }
    amount "9.99"
    state 1

    factory :transfer_with_game_centers do
      association :from_game_center, factory: :game_center, name: "from center1"
      association :to_game_center, factory: :game_center, name: "to center2"
    end
  end
end

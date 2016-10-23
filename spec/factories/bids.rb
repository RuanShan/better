FactoryGirl.define do
  factory :bid do
    game_round nil
    user nil
    amount "9.99"
    rate "9.99"
    state 1
  end
end

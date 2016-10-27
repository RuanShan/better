FactoryGirl.define do
  factory :game_center do
    name "Game Center"
    description "MyText"

    factory :master_game_center do
      name "Master Game Center"
      is_master true
    end
  end
end

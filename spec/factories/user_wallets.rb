FactoryGirl.define do
  factory :user_wallet do
    user nil
    game_center nil
    amount "9.99"
    memo "MyString"
    deleted_at "2016-10-22 23:02:20"
  end
end

FactoryGirl.define do
  factory :game do
    sequence(:name) { |n| "Game #{n}" }
    slug "MyString"
    description "MyText"
    state 1
  end
end

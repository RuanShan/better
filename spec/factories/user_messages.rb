FactoryGirl.define do
  factory :user_message do
    user
    message
    state 1
  end
end

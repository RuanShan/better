FactoryGirl.define do
  factory :deposit do
    payment_method nil
    user nil
    amount "9.99"
    state 1
  end
end

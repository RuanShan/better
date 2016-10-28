FactoryGirl.define do
  factory :deposit do
    payment_method
    user nil
    amount "9.99"
  end
end

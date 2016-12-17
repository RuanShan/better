FactoryGirl.define do
  factory :user_day do
    user nil
    effective_on "2016-11-02"
    deposit_amount "9.99"
    drawing_amount "9.99"
    bid_amount "9.99"
    bonus "9.99"
    bank_charges "0.1"
    platform_charges "1"
  end
end

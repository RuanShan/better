FactoryGirl.define do
  factory :user_month do
    user nil
    effective_on "2016-11-02"
    deposit_amount "99.99"
    drawing_amount "99.99"
    bid_amount "99.99"
    bonus "99.99"
    bank_charges "1"
    platform_charges "10"
  end
end

FactoryGirl.define do
  factory :user_bank do
    user nil
    name "bank"
    card_number "card number"
    branch_name "branch"
    address "address"
  end
end

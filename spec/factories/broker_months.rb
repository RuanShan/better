FactoryGirl.define do
  factory :sale_month do
    broker nil
    effective_on "2016-11-02"
    clink_visits 10
    blink_visits 10
    member_count 10
    valuable_member_count 10
    energetic_member_count 10
  end
end

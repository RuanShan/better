FactoryGirl.define do
  factory :broker_day do
    broker nil
    effective_on "2016-11-02"
    clink_visits 1
    blink_visits 1
    member_count 1
    valuable_member_count 1
    energetic_member_count 1
  end
end

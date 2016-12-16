FactoryGirl.define do
  factory :game_round do
    game
    paramd1 1
    start_at DateTime.now.beginning_of_hour
    period 300
    instrument_code 'USAUDUSD'
  end
end

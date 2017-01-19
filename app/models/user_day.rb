#User.first.user_days.select( "sum(deposit_amount) as deposit_amount" ).group(:user_id)
#[#<UserDay:0x000000061b1e98 id: nil, deposit_amount: #<BigDecimal:61c30f8,'0.0',9(27)>>]
class UserDay < ApplicationRecord
  extend BetterDateScope
  better_date_scope effective_on: [:today, :yesterday]

  extend DisplayMoney
  money_methods  :bid_amount, :balance, :bonus, :profit, :net

  belongs_to :user
  belongs_to :broker, optional: true

  # only for select( ... count(*) as group_count ).group( fields )
  attribute :group_count, :integer, default: 0
  attr_reader :net

  def net
    drawing_amount + balance - deposit_amount
  end
end

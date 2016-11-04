class UserMonth < ApplicationRecord
  extend BetterDateScope
  better_month_scope effective_on: [:current_month]

  belongs_to :user
  belongs_to :broker, optional: true

  # only for select( ... count(*) as group_count ).group( fields )
  #attribute :group_count, :integer, default: 0

end

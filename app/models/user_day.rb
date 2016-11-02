class UserDay < ApplicationRecord
  extend BetterDateScope
  better_date_scope effective_on: [:today]

  belongs_to :user

end

class PaymentMethod < ApplicationRecord
  enum state: {enabled: 1, disabled: 0}
end

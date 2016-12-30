# 促销活动
# 规则 rule
#  0. 充值， 当充值额在一定区间时，送充值额的百分比
#   factor1 <= 充值 <= factor2,  送  充值*factor3
#
class Promotion < ApplicationRecord
  extend  DisplayDateTime
  date_time_methods :created_at, :updated_at
  extend FriendlyId
  friendly_id :number, slug_column: :number, use: :slugged
  include NumberGenerator.new(prefix: 'P')

  belongs_to :administrator

  enum rule: { deposit_amount_percent: 1 , deposit_commission_default: 100 }

  def self.search(search_params)
    rule = search_params["rule"]
    if rule.present?
      self.where(rule: rule).order("created_at desc").all
    else
      self.order("created_at desc").all
    end
  end

  def valid_amount?(amount)
    case rule
    when 'deposit_amount_percent', 'deposit_commission_default'
      return true if amount >= factor1
    end
    return false
  end

  def compute_bonus(amount)
    case rule
    when 'deposit_amount_percent', 'deposit_commission_default'
      amount * factor3
    else
      0
    end
  end


end

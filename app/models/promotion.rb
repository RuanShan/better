# 促销活动
# 规则 rule
#  0. 充值， 当充值额在一定区间时，送充值额的百分比
#   factor1 <= 充值 <= factor2,  送  充值*factor3
#
class Promotion < ApplicationRecord

  def valid_amount?(amount)
    case rule
    when 1
      return true if amount >= factor1
    end
    return false
  end

  def compute_bonus(amount)
    case rule
    when 1
      factor3
    end
  end
end

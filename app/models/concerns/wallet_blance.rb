module WalletBlance
  extend ActiveSupport::Concern

  included do
    has_many :wallets
  end
  #============================money===========================================


  # 计算中心钱包的余额
  def wallet_balance
    wallets.sum(:amount)
    #wallets.inject(0){|total_amount,w|total_amount+=w.amount}
  end
  # 余额，应该和中心钱包的余额相同
  def balance
    user_days.last ? user_days.last.balance : 0
  end
  #充值总额
  def deposit_sum
    today_amount = user_today ? user_today.deposit_amount : 0
    user_months.sum(:deposit_amount)+today_amount
  end
  #提款总额
  def drawing_sum
    today_amount = user_today ? user_today.drawing_amount : 0
    user_months.sum(:drawing_amount)+today_amount
  end
  #投注总额
  def bid_sum
    today_amount = user_today ? user_today.bid_amount : 0
    user_months.sum(:bid_amount)+today_amount
  end
  #红利总额
  def bonus_sum
    today_amount = user_today ? user_today.bonus : 0
    user_months.sum(:bonus)+today_amount
  end
  #盈利总额
  def profit_sum
    today_amount = user_today ? user_today.profit : 0
    user_months.sum(:profit)+today_amount
  end
  #输赢总额
  def net_sum
    drawing_sum + balance - deposit_sum
  end

  #可用现金
  def net_cash
    balance > delta_cash ? delta_cash : 0;
  end

  #可用赠金
  def net_bonus
    balance - delta_cash
  end

  def delta_cash
    deposit_sum - drawing_sum
  end

end

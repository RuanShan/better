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
    life_statis.balance
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
    life_statis.deposit_amount - life_statis.drawing_amount
  end

end

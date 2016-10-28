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

end

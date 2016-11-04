#处理 UserDay, BrokerDay 更新逻辑
class DayUpdater
  attr_accessor :wallet, :user
  attr_accessor :is_first_deposit_today

  delegate :broker, to: :user

  def initialize( wallet )
    self.wallet = wallet
    self.user = wallet.user
    self.is_first_deposit_today  =  false
  end

  def process!
    update_user_day
    update_broker_day
  end

  def update_user_day
    amount = wallet.amount
    day = user.user_today || user.build_user_today( broker: user.broker, balance: user.user_life.balance )
    if amount > 0
      if wallet.is_bonus #红利
        day.bonus_amount += amount
      else        #存款
        self.is_first_deposit_today = true if day.deposit_amount == 0
        day.deposit_amount += amount
      end
    else          #提款
      day.drawing_amount -= amount
    end

    # 判断用户本月是否活跃
    # 存款不低于500元，投注流水不低于1000元
    user_month

    day.balance += amount
    day.save!
  end

  def update_broker_day
    return unless broker
    day = broker.broker_today || broker.build_broker_today( balance: user.user_life.balance )
    # 今日注册用户且存款， 更新代理今日统计
    if is_first_deposit_today && user.created_at.today?
      day.valuable_member_count += 1
    end

    day.save!
  end

end

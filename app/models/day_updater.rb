#处理 UserDay, BrokerDay 更新逻辑
class DayUpdater
  EnergeticMemberMinDeposit = 500
  EnergeticMemberMinBid = 1000
  PlatformChargeRate = 0.1
  BankChargeRate = 0.005
  attr_accessor :wallet, :user
  attr_accessor :is_first_deposit_today, :is_energetic_member

  delegate :broker, to: :user
  delegate :is_bonus?, to: :wallet

  def initialize( wallet )
    self.wallet = wallet
    self.user = wallet.user
    self.is_first_deposit_today  =  false
    self.is_energetic_member = false
  end

  def process!
    update_user_day
    update_broker_day
  end

  def update_user_day
    amount = wallet.amount
    day = user.user_today || user.build_user_today( broker: user.broker, balance: user.user_life.balance )

    if is_deposit?              #存款
      if is_bonus? #红利
        day.bonus += amount
      else        #存款
        self.is_first_deposit_today = true if day.deposit_amount == 0
        day.deposit_amount += amount
      end
    elsif is_drawing?           #提款提款提款
      day.drawing_amount -= amount
      day.bank_charges += amount * BankChargeRate
    elsif is_bid?
      if amount < 0             #投注
        day.bid_amount -= amount
        day.platform_charges += amount * PlatformChargeRate
      else
        if is_bonus?            #投注收益
          day.profit += amount
        else                    #投注本金

        end
      end
    end

    day.balance += amount
    day.save!

    # 判断用户本月是否活跃
    # 存款不低于500元，投注流水不低于1000元
    # 如果用户当天注册， user_month 为空
    month = user.user_month || user.create_user_month!( broker: user.broker, balance: user.user_life.balance )
    if month.deposit_amount < EnergeticMemberMinDeposit && month.deposit_amount+ day.deposit_amount >= EnergeticMemberMinDeposit
      is_energetic_member = true if month.bid_amount+ day.bid_amount >= EnergeticMemberMinBid
    end
  end

  def update_broker_day
    return unless broker
    day = broker.broker_today || broker.build_broker_today( balance: user.user_life.balance )
    # 今日注册用户且存款， 更新代理今日统计
    if is_first_deposit_today && user.created_at.today?
      day.valuable_member_count += 1
    end
    if is_energetic_member
      day.energetic_member_count += 1
    end
    day.save!
  end

  def is_deposit?
    wallet.originator.is_a? Deposit
  end

  def is_drawing?
    wallet.originator.is_a? Drawing
  end

  def is_bid?
    wallet.originator.is_a? Bid
  end
end

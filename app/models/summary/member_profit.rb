module Summary
  #会员明细表
  class MemberProfit < ProfitBase
    attr_accessor :user
    delegate :user_life, to: :user

    def initialize( user)
      super()
      self.user = user
      self.from_date = user.created_at.to_date
      self.to_date = DateTime.current.to_date

      initialize_attributes
    end


    def initialize_attributes
      # 取得用户生命周期的数据
      # user_life + user_today
      deposit_amount = user_life.deposit_amount + user_today.deposit_amount
      drawing_amount = user_life.drawing_amount + user_today.drawing_amount
      bid_amount = user_life.bid_amount + user_today.bid_amount

      bonus = user_life.bonus + user_today.bonus
      profit = user_life.profit + user_today.profit
      balance = user_today.new_record? ? user_life.balance : user_today.balance
      net = drawing_amount + balance - deposit_amount
    end

    # user_today 可能为 nil，所以构建一个 值为 0 对象。
    # 不能用 user.build_user_today, 否则 user.save 会保存那个对象。
    def user_today
      user.user_today || UserDay.new
    end
  end
end

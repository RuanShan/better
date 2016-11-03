class Wallet < ApplicationRecord
  extend DisplayMoney
  money_methods :amount
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :user, required: true

  scope :bonuses, -> { where(is_bonus: true) }

  after_create :adjust_user_day

  def self.search_bonuses(search_params)
    self.bonuses.where("created_at>? and created_at<?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime).order("created_at desc").all
  end

  private

  def adjust_user_day
    day = user.user_today || user.build_user_today( broker: user.broker )
    if amount > 0
      if is_bonus #红利
        day.bonus_amount += amount
      else        #存款
        # 今日注册用户且存款， 更新代理今日统计
        if user.created_at.today? && day.deposit_amount == 0
          if user.broker
            user.broker.broker_today.valued_user_counter += 1
            user.broker.broker_today.save!
          end
        end
        day.deposit_amount += amount
      end
    else          #提款
      day.drawing_amount -= amount
    end
    day.save!
  end

end

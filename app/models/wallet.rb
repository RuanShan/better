class Wallet < ApplicationRecord
  extend  DisplayDateTime
  date_time_methods :created_at

  belongs_to :user, required: true

  scope :bonuses, -> { where(is_bonus: true) }
  #enum originator_type: { deposit:0, drawing: 1, transfer:2, bid:3 }

  def self.add_wallet(originator)
    wallet_params = get_params(originator)
    user = originator.user
    wallet_params.each{|wallet_param| new_wallet = user.wallets.create(wallet_param)}
  end

  def self.search_bonuses(search_params)
    self.bonuses.where("created_at>? and created_at<?",(search_params["start_date"]+" 00:00:00").to_datetime,
    (search_params["end_date"]+" 23:59:59").to_datetime).order("created_at desc").all
  end

  private

  def self.get_params(originator)
    originator_type = originator.class.name.downcase
    wallet_param = { amount: originator.amount, memo: "", originator_id: originator.id, originator_type: originator_type, is_bonus: false}
    wallet_params =[]
    if originator.instance_of? Deposit
      wallet_params << wallet_param
      if originator.bonus>0
        bonus_param = wallet_param.dup
        bonus_param[:amount] = originator.bonus
        bonus_param[:is_bonus]=true
        wallet_params << bonus_param
      end
    elsif originator.instance_of? Drawing
      wallet_param[:amount] = -wallet_param[:amount]
      wallet_params << wallet_param

    elsif originator.instance_of? Bid
      wallet_param[:amount] = originator.win_lose_amount
      wallet_param[:is_bonus]=true if originator.win_lose_amount > 0
      wallet_params << wallet_param
    else
    end
    wallet_params
  end
end

class UserWallet < ApplicationRecord
  belongs_to :user
  belongs_to :game_center

  enum originator_type: { deposit:0, drawing: 1, transfer:2, bid:3 }

  def self.add_wallet(originator)
    wallet_params = get_params(originator)
    user = originator.user
    wallet_params.each{|wallet_param| new_wallet = user.user_wallets.create(wallet_param)}
  end

  private

  def self.get_params(originator)
    originator_type = originator.class.name.downcase
    wallet_param = {game_center: originator.try(:game_center), amount: originator.amount, memo: "", originator_id: originator.id, originator_type: originator_type, is_bonus: false}
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
    elsif originator.instance_of? Transfer
      from_param = wallet_param
      to_param = wallet_param.dup
      from_param[:game_center] = originator.from_game_center
      to_param[:game_center] = originator.to_game_center
      from_param[:amount] = - from_param[:amount]
      wallet_params = [from_param, to_param]
    elsif originator.instance_of? Bid
      wallet_param[:game_center] = originator.game_center
      wallet_param[:amount] = originator.win_lose_amount
      wallet_param[:is_bonus]=true if originator.win_lose_amount > 0
      wallet_params << wallet_param
    else
    end
    wallet_params
  end
end

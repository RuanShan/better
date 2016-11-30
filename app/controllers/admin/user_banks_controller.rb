class Admin::UserBanksController < Admin::BaseController
  def index
    @user = User.find(params[:user_id])
    @user_banks = @user.user_banks
  end

  def show
    @user = User.find(params[:user_id])
    @user_bank = UserBank.find(params[:id])
  end
end

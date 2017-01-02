module Admin
  class UserBanksController < BaseController
    def index
      @user = User.find(params[:user_id])
      @user_banks = @user.user_banks
    end

    def show
      @user = User.find(params[:user_id])
      @user_bank = UserBank.find(params[:id])
    end


    def enable
      @user_bank = UserBank.find(params[:user_bank_id])
      @user = @user_bank.user
      @user_bank.green!
      redirect_to admin_user_user_bank_path(@user, @user_bank) 
    end

    def disable
      @user_bank = UserBank.find(params[:user_bank_id])
      @user = @user_bank.user
      @user_bank.red!
      redirect_to admin_user_user_bank_path(@user, @user_bank)
    end

  end
end

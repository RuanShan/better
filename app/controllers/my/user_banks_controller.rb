module My
  class UserBanksController < BaseController

    def new
      if current_user.bind_name?
        @user_bank = current_user.user_banks.green.present? ? current_user.user_banks.green.first : current_user.user_banks.new
      else
        flash[:notice] = t(:bind_name_first)
        redirect_to bind_name_my_account_path(current_user)
      end
    end

    def create
      @user_bank = UserBank.valid_create(current_user, bank_params)
      if @user_bank.errors.empty?
        flash[:notice] = t(:bind_bank_success)
        redirect_to security_center_my_account_path(current_user)
      else
        render :new
      end
    end

    private

    def bank_params
      params.require(:user_bank).permit(:name, :card_number, :branch_name, :address, :current_money_password)
    end

  end
end

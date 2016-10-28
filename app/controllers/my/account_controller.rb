module My
  class AccountController < BaseController

    def index
      @user = current_user
      @deposits = @user.deposits.order("created_at desc").limit(10)
    end

    def deposit
      @user = current_user
      @game_centers = GameCenter.all
    end

    def show
      @user = current_user
      @deposits = @user.deposits.order("created_at desc").limit(10)
    end

    def update
      @user = User.find(params[:id])
      if @user.update_attributes(secure_params)
        redirect_to users_path, :notice => "User updated."
      else
        redirect_to users_path, :alert => "Unable to update user."
      end
    end

    def destroy
      user = User.find(params[:id])
      user.destroy
      redirect_to users_path, :notice => "User deleted."
    end

    def change_password
      if request.patch?
        current_user.change_password(params["user"])
        if current_user.errors.empty?
          flash[:notice] = "Password changed!"
        end
        render :change_password
      end
    end

    def change_profile
      if request.patch?
        current_user.update_attributes(profile_params)
        if current_user.errors.empty?
          flash[:notice] = "Profile updated!"
        end
        render :change_profile
      end
    end

    def set_email
      if request.patch?
        current_user.set_email(email_params)
        if current_user.errors.empty?
          flash[:notice] = "we've send an email to you, please confirm it!"
          redirect_to security_center_my_account_path(current_user)
        else
          render :set_email
        end
      end
    end

    def set_password_protection
      if request.patch?
        current_user.set_password_protection(pp_params)
        if current_user.errors.empty?
          flash[:notice] = "password protection success!"
          redirect_to security_center_my_account_path(current_user)
        else
          render :set_password_protection
        end
      end
    end

    def bind_name
      if request.patch?
        send_code = params["send_code"].to_i
        current_user.bind_name(send_code, bind_name_params, session)
        if current_user.errors.empty?
          flash[:notice] = "bind name success!"
          redirect_to security_center_my_account_path(current_user)
        else
          render :bind_name
        end
      end
    end

    def bind_bank
      if request.post?
        current_money_password = params["current_money_password"]
        new_bank = current_user.bind_bank(current_money_password, bank_params)
        if new_bank.errors.empty?
          flash[:notice] = "bind bank success!"
          redirect_to security_center_my_account_path(current_user)
        else
          render :bind_bank
        end
      else
        @user_bank = current_user.bind_bank? ? current_user.user_banks.first : current_user.user_banks.new
      end
    end

    private


    def secure_params
      params.require(:user).permit(:role)
    end

    def email_params
      params.require(:user).permit(:current_password, :email)
    end

    def profile_params
      params.require(:user).permit(:gender, :phone, :qq)
    end

    def pp_params
      params.require(:user).permit(:pp_question, :pp_answer)
    end

    def bind_name_params
      params.require(:user).permit(:real_name, :id_type, :id_number, :phone, :validate_code, :commit)
    end

    def bank_params
      params.require(:user_bank).permit(:name, :card_number, :branch_name, :address)
    end

  end
end

module My
  class AccountController < BaseController

    def index
      @user = current_seller
      @user_month = Summary::SaleMonthlyFactory.create("profit", @user.member_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
      @user_day = Summary::BrokerDailyProfitFactory.create( @user.member_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
      #@bonuses = @user.wallets.bonuses.includes(:originator).order("created_at desc").limit(10)
      #@bids = @user.bids.order("created_at desc").limit(10)
      #@deposits = @user.deposits.order("created_at desc").limit(10)
      #@drawings = @user.drawings.order("created_at desc").limit(10)
    end

    def deposit
      @user = current_user
    end

    def invitable_qrcode
    end

    def show
      @user = current_user
      @deposits = @user.deposits.order("created_at desc").limit(10)
    end

    def change_password
      @selected_password = params["selected_password"] ? params["selected_password"] : "login"
      if request.patch?
        @selected_password = params["user"]["password"] ? "login" : "money"
        user_params = @selected_password == "login" ? login_password_params : money_password_params
        current_user.change_password(user_params)
        if current_user.errors.empty?
          flash[:notice] = @selected_password == "login" ? t(:login_password_changed) : t(:money_password_changed)
        end
        if request.variant.first == :mobile
          rview = "edit_#{@selected_password}_password"
          render rview
        else
          render :change_password
        end
      end
    end

    def change_profile
      if request.patch?
        current_user.update_attributes(profile_params)
        if current_user.errors.empty?
          flash[:notice] = t(:profile_updated)
        end
        render :change_profile
      end
    end

    def update_profile
      if request.patch?
        current_user.update_attributes(center_profile_params)
        if current_user.errors.empty?
          flash[:notice] = t(:profile_updated)
        end
        render :index
      end
    end

    def set_email
      if request.patch?
        current_user.set_email(email_params)
        if current_user.errors.empty?
          flash[:notice] = t(:send_email_for_user_confirm_new_email)
          redirect_to security_center_my_account_path(current_user)
        else
          render :set_email
        end
      end
    end

    def edit_login_password
    end
    
    def edit_money_password
    end

    def set_password_protection
      if request.patch?
        current_user.set_password_protection(pp_params)
        if current_user.errors.empty?
          flash[:notice] = t(:password_protection_success)
          redirect_to security_center_my_account_path(current_user)
        else
          render :set_password_protection
        end
      end
    end

    def bind_name
      if request.patch?
        sms = Sms.new(phone: session["sms"]["phone"], code:session["sms"]["code"], send_at:session["sms"]["send_at"] )
        unless sms.verify_sign_up_sms( bind_name_params["phone"], bind_name_params["validate_code"] )
          current_user.errors.messages.merge!(sms.errors.messages)
        end
        current_user.bind_name(bind_name_params)
        if current_user.errors.empty?
          flash[:notice] = t(:bind_name_success)
          redirect_to security_center_my_account_path(current_user)
        else
          render :bind_name
        end
      end
    end

    private

    def secure_params
      params.require(:user).permit(:role)
    end

    def login_password_params
      params.require(:user).permit(:current_password, :password, :password_confirmation)
    end

    def money_password_params
      params.require(:user).permit(:current_money_password, :money_password, :money_password_confirmation)
    end

    def email_params
      params.require(:user).permit(:current_password, :email)
    end

    def profile_params
      params.require(:user).permit(:first_name, :last_name, :gender, :phone, :qq)
    end

    def center_profile_params
      params.require(:user).permit(:first_name, :last_name, :email, :phone, :qq, :id_number, :birthday, :address, :city, :province, :country_code, :postcode)
    end

    def pp_params
      params.require(:user).permit(:pp_question, :pp_answer)
    end

    def bind_name_params
      params.require(:user).permit(:first_name, :last_name, :id_type, :id_number, :phone, :validate_code)
    end

  end
end

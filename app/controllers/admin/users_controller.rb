module Admin
  class UsersController < BaseController
    before_action :set_user, only: [:lock, :data, :show, :edit, :update, :destroy, :record, :change_login_password, :change_money_password, :password_protect]

    def index
      @page = params['page'] || 1
      if params['user_display'].present?
        session[:user_display] = params['user_display'] == 'tree' ? 'tree' : 'list'
      else
        session[:user_display] = session[:user_display].present? ? session[:user_display] : 'list'
      end
      @user_display = session[:user_display]
      if @user_display == 'tree'
        @users = User.roots.order("created_at desc").all.paginate(:page => @page)
      else
        @users = User.order("created_at desc").all.paginate(:page => @page)
      end
      respond_to do |format|
        format.html
        format.csv do
          csv_file_name = "user_records.csv"
          send_data User.admin_generate_csv(@users, col_sep: ","), filename: csv_file_name
        end
      end
    end

    def new
      @user = User.new
    end

    def create
      @user = User.create(user_params)
      if @user.errors.empty?
        flash[:notice] = t(:user_created)
        redirect_to admin_users_path
      else
        render :new
      end
    end

    def show
    end

    def edit
    end

    def update
      if @user.update_attributes(secure_params)
        flash[:notice] = t(:user_updated)
        redirect_to admin_users_path
      else
        render :edit
      end
    end

    def change_login_password
      if request.patch?
        @user.admin_change_password(login_password_params, current_administrator.id)
        if @user.errors.empty?
          flash[:notice] = t(:login_password_changed)
        end
      end
    end

    def change_money_password
      if request.patch?
        @user.admin_change_password(money_password_params, current_administrator.id)
        if @user.errors.empty?
          flash[:notice] = t(:money_password_changed)
        end
      end
    end

    def password_protect
      if request.patch?
        @user.admin_set_password_protection(pp_params, current_administrator.id)
        if @user.errors.empty?
          flash[:notice] = t(:password_protection_success)
        end
      end
    end

    def batch_delete
      user_ids = params["selected_users"]
      if user_ids.blank?
        flash[:error] = t(:no_selected_users)
      else
        User.destroy(user_ids)
        flash[:notice] = t(:multi_user_deleted)
      end
      redirect_to admin_users_path
    end

    def destroy
      user = User.find(params[:id])
      user.destroy
      flash[:notice] = t(:user_deleted)
      redirect_to admin_users_path
    end

    def search
      @page = params['page']
      @users = User.where("email=?", params['email']).order("created_at desc").all.paginate(:page => @page)
      render :index
    end

    def record
      @record_for = params['record_for']
      @page = params["page"]
      if @record_for == "bonus"
        @bonuses = Wallet.bonuses.where(user_id: @user.id).order(created_at: :desc).paginate(:page => @page)
      else
        records = @record_for.camelize.constantize.where(user_id: @user.id).order(created_at: :desc).paginate(:page => @page)
        instance_variable_set("@#{@record_for}s", records)
      end
      render "#{@record_for}_record"
    end

    def data
      @user_seller = CurrentSeller.new( @user )
      @user_month = Summary::SaleMonthlyFactory.create("profit", @user_seller.descendant_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
      @user_day = Summary::BrokerDailyProfitFactory.create( @user_seller.descendant_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
    end

    def lock
      if @user.access_locked?
        @user.unlock_access!
      else
        @user.lock_access!
      end
      redirect_to action: :index, page: params[:page]
    end

    def bid_statistic
      q = User.includes( :user_today, :user_tomonth, :user_life)
      if params[:email].present?
        q = q.where(email: params[:email])
      end
      @users = q.paginate(:page => params[:page])
    end

    private
    def set_user
      @user =  User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:first_name, :last_name, :password, :password_confirmation, :email, :phone, :gender, 'birthday(1i)', 'birthday(2i)', 'birthday(3i)', :id_number, :qq, :country_code, :province, :city, :address, :postcode, :lang)
    end

    def secure_params
      params.require(:user).permit(:first_name, :last_name, :email, :phone, :gender, 'birthday(1i)', 'birthday(2i)', 'birthday(3i)', :id_number, :qq, :country_code, :province, :city, :address, :postcode, :lang)
    end

    def login_password_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    def money_password_params
      params.require(:user).permit(:money_password, :money_password_confirmation)
    end

    def pp_params
      params.require(:user).permit(:pp_question, :pp_answer)
    end

  end
end

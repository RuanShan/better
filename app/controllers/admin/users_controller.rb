class Admin::UsersController < Admin::BaseController

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
    @user = User.find(params[:id])
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(secure_params)
      flash[:notice] = t(:user_updated)
      redirect_to admin_users_path
    else
      render :edit
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
    @users = User.where("nickname=?", params['nickname']).order("created_at desc").all.paginate(:page => @page)
    render :index
  end

  def record
    @record_for = params['record_for']
    @page = params["page"]
    @user = User.find(params[:id])
    if @record_for == "bonus"
      @bonuses = Wallet.bonuses.order("created_at desc").all.paginate(:page => @page)
    else
      records = @record_for.camelize.constantize.order("created_at desc").all.paginate(:page => @page)
      instance_variable_set("@#{@record_for}s", records)
    end
  end

  def data
    @user = User.find(params[:id])
    @user_seller = CurrentSeller.new( @user )
    @user_month = Summary::SaleMonthlyFactory.create("profit", @user_seller.member_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
    @user_day = Summary::BrokerDailyProfitFactory.create( @user_seller.member_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
  end

  private

  def user_params
    params.require(:user).permit(:nickname, :email, :phone, :password, :password_confirmation)
  end

  def secure_params
    params.require(:user).permit(:nickname, :email, :phone)
  end

end

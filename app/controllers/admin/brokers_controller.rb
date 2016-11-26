class Admin::BrokersController < Admin::BaseController

  def index
    @page = params['page'] || 1
    if params['display'].present?
      session[:display] = params['display'] == 'tree' ? 'tree' : 'list'
    else
      session[:display] = session[:display].present? ? session[:display] : 'list'
    end
    @display = session[:display]
    if @display == 'tree'
      @brokers = Broker.roots.order("created_at desc").all.paginate(:page => @page)
    else
      @brokers = Broker.order("created_at desc").all.paginate(:page => @page)
    end
  end

  def new
    @broker = Broker.new
  end

  def create
    @broker = Broker.create(broker_params)
    if @broker.errors.empty?
      flash[:notice] = t(:broker_created)
      redirect_to admin_brokers_path
    else
      render :new
    end
  end

  def show
    @broker = Broker.find_by_id(params[:id])
  end

  def edit
    @broker = Broker.find_by_id(params[:id])
  end

  def update
    @broker = Broker.find_by_id(params[:id])
    if @broker.update_attributes(secure_params)
      flash[:notice] = t(:broker_updated)
      redirect_to admin_brokers_path
    else
      render :edit
    end
  end

  def batch_delete
    broker_ids = params["selected_brokers"]
    if broker_ids.blank?
      flash[:error] = t(:no_selected_brokers)
    else
      brokers = Broker.find(broker_ids)
      Broker.destroy(brokers.map(&:id))
      flash[:notice] = t(:multi_broker_deleted)
    end
    redirect_to admin_brokers_path
  end

  def destroy
    broker = Broker.find_by_id(params[:id])
    broker.destroy
    flash[:notice] = t(:broker_deleted)
    redirect_to admin_brokers_path
  end

  def search
    @page = params['page']
    @brokers = Broker.where("nickname=?", params['nickname']).order("created_at desc").all.paginate(:page => @page)
    render :index
  end

  def batch_confirm
    @page = params['page']
    broker_ids = params["selected_brokers"]
    if broker_ids.blank?
      flash[:error] = t(:no_selected_brokers)
    else
      brokers = Broker.find(broker_ids)
      brokers.each do |broker|
        broker.confirm
        broker.send_confirmation_instructions
      end
      flash[:notice] = t(:multi_broker_confirmed)
    end
    redirect_to admin_brokers_path+"?page=#{@page}"
  end

  def confirm
    @page = params['page']
    @broker = Broker.find_by_id(params[:id])
    @broker.confirm
    @broker.send_confirmation_instructions
    redirect_to admin_brokers_path+"?page=#{@page}"
  end

  def batch_lock
    @page = params['page']
    broker_ids = params["selected_brokers"]
    if broker_ids.blank?
      flash[:error] = t(:no_selected_brokers)
    else
      brokers = Broker.find(broker_ids)
      brokers.each do |broker|
        broker.access_locked? ? broker.unlock_access! : broker.lock_access!
      end
      flash[:notice] = t(:multi_broker_confirmed)
    end
    redirect_to admin_brokers_path+"?page=#{@page}"
  end

  def lock
    @page = params['page']
    @broker = Broker.find_by_id(params[:id])
    @broker.access_locked? ? @broker.unlock_access! : @broker.lock_access!
    redirect_to admin_brokers_path+"?page=#{@page}"
  end

  def data
    @broker = Broker.find_by_id(params[:id])
    @user_month = Summary::SaleMonthlyFactory.create("profit", @broker.member_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
    @user_day = Summary::BrokerDailyProfitFactory.create( @broker.member_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
  end

  def report
  end

  private

  def broker_params
    params.require(:broker).permit(:nickname, :email, :phone, :password, :password_confirmation)
  end

  def secure_params
    params.require(:broker).permit(:nickname, :email, :phone)
  end

end

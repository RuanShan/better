class Admin::BrokersController < Admin::BaseController

  def index
    @page = params['page']
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
    @broker = Broker.find_by_number(params[:id])
  end

  def edit
    @broker = Broker.find_by_number(params[:id])
  end

  def update
    @broker = Broker.find_by_number(params[:id])
    if @broker.update_attributes(secure_params)
      flash[:notice] = t(:broker_updated)
      redirect_to admin_brokers_path
    else
      render :edit
    end
  end

  def delete
    broker_numbers = params["selected_brokers"]
    if broker_numbers.blank?
      flash[:error] = t(:no_selected_brokers)
    else
      *brokers = Broker.find_by_number(broker_numbers)
      Broker.destroy(brokers.map(&:id))
      flash[:notice] = t(:multi_broker_deleted)
    end
    redirect_to admin_brokers_path
  end

  def destroy
    broker = Broker.find_by_number(params[:id])
    broker.destroy
    flash[:notice] = t(:broker_deleted)
    redirect_to admin_brokers_path
  end

  def search
    @page = params['page']
    @brokers = Broker.where("nickname=?", params['nickname']).order("created_at desc").all.paginate(:page => @page)
    render :index
  end

  private

  def broker_params
    params.require(:broker).permit(:nickname, :email, :phone, :password, :password_confirmation)
  end

  def secure_params
    params.require(:broker).permit(:nickname, :email, :phone)
  end

end

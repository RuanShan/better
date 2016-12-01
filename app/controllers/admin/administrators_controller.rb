class Admin::AdministratorsController < Admin::BaseController

  def index
    @page = params['page'] || 1
    @administrators = Administrator.order("created_at desc").all.paginate(:page => @page)
  end

  def new
    @administrator = Administrator.new
  end

  def create
    @administrator = Administrator.create(administrator_params)
    if @administrator.errors.empty?
      flash[:notice] = t(:administrator_created)
      redirect_to admin_administrators_path
    else
      render :new
    end
  end

  def show
    @administrator = Administrator.find(params["id"])
  end

  def edit
    @administrator = Administrator.find(params["id"])
  end

  def update
    @administrator = Administrator.find(params["id"])
    if @administrator.update_attributes(administrator_params)
      flash[:notice] = t(:administrator_updated)
      redirect_to admin_administrators_path
    else
      render :edit
    end
  end

  def destroy
    administrator = Administrator.find(params["id"])
    unless administrator.id == current_administrator.id
      administrator.destroy
      flash[:notice] = t(:administrator_deleted)
    else
      flash[:notice] = t(:administrator_deleted_failed)
    end
    redirect_to admin_administrators_path
  end

  def batch_delete
    administrator_ids = params["selected_administrators"]
    if administrator_ids.blank?
      flash[:error] = t(:no_selected_administrators)
    else
      unless administrator_ids.include? current_administrator.id.to_s
        Administrator.destroy(administrator_ids)
        flash[:notice] = t(:multi_administrators_deleted)
      else
        flash[:notice] = t(:administrator_deleted_failed)
      end
    end
    redirect_to admin_administrators_path
  end

  private

  def administrator_params
    params.require(:administrator).permit(:email, :password, :password_confirmation)
  end
end

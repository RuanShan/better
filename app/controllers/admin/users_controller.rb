class Admin::UsersController < ApplicationController
  before_action :authenticate_administrator!
  layout "admin"

  def new
    @user = User.new
  end

  def create
    @user = User.create(user_params)
    if @user.errors.empty?
      flash[:notice] = t(:user_created)
    end
    render :new
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(secure_params)
      redirect_to admin_users_path, :notice => t :user_updated
    else
      render :edit
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    redirect_to admin_users_path, :notice => t :user_deleted
  end

  def index
    @page = params['page']
    @users = User.order("created_at desc").all.paginate(:page => @page)
  end

  def search
    @page = params['page']
    logger.debug "params['nickname']=#{params['nickname']}"
    @users = User.where("nickname=?", params['nickname']).order("created_at desc").all.paginate(:page => @page)
    render :index
  end

  private

  def user_params
    params.require(:user).permit(:nickname, :email, :phone, :password, :password_confirmation)
  end

  def secure_params
    params.require(:user).permit(:nickname, :email, :phone)
  end

end

class Users::RegistrationsController < DeviseInvitable::RegistrationsController
  def create
    if params["reg-agreement"] && params["reg-agreement"] == "on"
      send_code = params["send_code"].to_i
      code_options = get_code_options
      @user = User.new
      @user.save_with_validate_code(send_code, sign_up_params, code_options)
      set_code_options(code_options)
      if @user.errors.empty?
        flash[:notice] = "注册成功"
        redirect_to root_path
      else
        render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
      end
    else
      flash[:notice] = "请阅读并同意服务条款和隐私政策"
      render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
    end
  end

  private

  def sign_up_params
    params["user"]["type"] = "User"
    params.require(:user).permit(:type, :first_name, :last_name, :email, :qq, :phone, :password, :broker_id, :validate_code).to_h
  end

  def get_code_options
    code_options = {}
    if session["validate_phone"].present?
      code_options["validate_phone"] = session["validate_phone"]
      code_options["validate_code"] = session["validate_code"]
      code_options["validate_code_send_time"] = session["validate_code_send_time"]
    end
    code_options
  end

  def set_code_options(code_options)
    session["validate_phone"] = code_options["validate_phone"]
    session["validate_code"] = code_options["validate_code"]
    session["validate_code_send_time"] = code_options["validate_code_send_time"]
  end

end

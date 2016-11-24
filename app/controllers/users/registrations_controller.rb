class Users::RegistrationsController < DeviseInvitable::RegistrationsController

  def new
    if params["inviter_number"].present?
      session["inviter_number"] = params["inviter_number"]
    end
    super
  end

  def create
    @user = User.new
    if check_agreement? && (params["affiliate"] == "0" || my_broker.present?)
      send_code = params["send_code"].to_i
      code_options = get_code_options
      @user.save_with_validate_code(send_code, sign_up_params, code_options)
      set_code_options(code_options)
      if @user.errors.empty?
        flash[:notice] = "注册成功"
        if session["inviter_number"].present?
          session.delete("inviter_number")
        end
        if request.xhr?
          render :js => "window.location = '#{new_user_session_path}';"
        else
          redirect_to new_user_session_path
        end
      else
        if request.xhr?
          render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
        else
          render "new"
        end
      end
    else
      flash[:notice] = "请阅读并同意服务条款和隐私政策" unless check_agreement?
      @user.errors.add(:broker_number, "经纪人编码错误") if my_broker.blank?
      if request.xhr?
        render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
      else
        render "new"
      end
    end
  end

  private

  def sign_up_params
    params["user"]["type"] = "User"
    extra_params = []
    if my_broker.present?
      params["user"]["broker_id"] = my_broker.id
      extra_params << :broker_id
    elsif session["broker_number"]
      broker = Broker.find_by_number(session["broker_number"])
      params["user"]["broker_id"] = broker.id if broker.present?
      extra_params << :broker_id
    elsif session["inviter_number"]
      user = User.find_by_number(session["inviter_number"])
      if user.present?
        params["user"]["parent_id"] = user.id
        params["user"]["broker_id"] = user.broker_id
        extra_params += [:parent_id, :broker_id]
      end
    end
    if request.xhr?
      permitted_params = [:type, :first_name, :last_name, :email, :qq, :phone, :password, :validate_code]
    else
      permitted_params = [:type, :last_name, :first_name, :email, :qq, :phone, :birthday, :country_code, :qq, :phone, :password, :password_confirmation, :validate_code]
    end
    params.require(:user).permit(extra_params+permitted_params).to_h
  end

  def check_agreement?
    if request.xhr?
      params["reg-agreement"] && params["reg-agreement"] == "on"
    else
      params["age"] && params["age"] == "on" && params["provideinformation"] && params["provideinformation"] == "on" && params["terms"] && params["terms"] == "on"
    end
  end

  def my_broker
    Broker.find_by_number(params["user"]["broker_number"])
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

class RegistrationsController < DeviseInvitable::RegistrationsController
  before_action :verify_sign_up_sms, only: [:create]

  def new
    if params["inviter_number"].present?
      session["inviter_number"] = params["inviter_number"]
    end
    super
  end

  def create
    #@user = User.new
    @broker = get_broker_by_broker_number
    @parent = get_parent_by_inviter_number

      permitted_params = sign_up_params
      permitted_params[:broker] = @broker
      permitted_params[:parent] = @parent
      permitted_params[:type] = "User"
      build_resource(permitted_params)

          resource.save
          yield resource if block_given?
          if resource.persisted?
            if resource.active_for_authentication?
              set_flash_message! :notice, :signed_up
              sign_up(resource_name, resource)
              if request.xhr?
                render :js => "window.location = '#{after_sign_up_path_for(resource)}';"
              else
                respond_with resource, location: after_sign_up_path_for(resource)
              end
            else
              set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
              expire_data_after_sign_in!
              if request.xhr?
                render :js => "window.location = '#{after_inactive_sign_up_path_for(resource)}';"
              else
                respond_with resource, location: after_inactive_sign_up_path_for(resource)
              end
            end
          else
            clean_up_passwords resource
            set_minimum_password_length
            if request.xhr?
              render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
            else
              respond_with resource
            end
          end

#      send_code = params["send_code"].to_i
#      code_options = get_code_options
#      @user.save_with_validate_code(send_code, sign_up_params, code_options)
#      set_code_options(code_options)
#      if @user.errors.empty?
#        flash[:notice] = "注册成功"
#        #if session["inviter_number"].present?
#        #  session.delete("inviter_number")
#        #end
#        if request.xhr?
#          render :js => "window.location = '#{new_user_session_path}';"
#        else
#          redirect_to new_user_session_path
#        end
#      else
#        if request.xhr?
#          render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
#        else
#          render "new"
#        end
#      end
#    else
#      flash[:notice] = "请阅读并同意服务条款和隐私政策" unless check_agreement?
#      @user.errors.add(:broker_number, "经纪人编码错误") if my_broker.blank?
#      if request.xhr?
#        render 'shared/partials', locals:{ partial_hash: {"#sign_up_block"=>"sign_up"} }
#      else
#        render "new"
#      end
#    end
  end

  private

  def sign_up_params
    #params["user"]["type"] = "User"

    if request.xhr?
      permitted_params = [:type, :first_name, :last_name, :email, :qq, :phone, :password, :validate_code]
    else
      permitted_params = [:type, :last_name, :first_name, :email, :qq, :phone, :birthday, :country_code, :qq, :phone, :password, :password_confirmation, :validate_code]
    end
    params.require(:user).permit(*permitted_params)
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


  private
  def get_parent_by_inviter_number
    User.find_by_number(session["inviter_number"])
  end

  def get_broker_by_broker_number
    broker_number = params.try(:user).try(:broker_number)
    broker_number ||= session["broker_number"]
    Broker.find_by_number(broker_number) if broker_number
  end

  def verify_sign_up_sms
    permitted_params = sign_up_params
    serialized_sms = session[:sign_up_sms]||{}
    # sms serialized as json in session, it is string key hash here
    sms = Sms.new( phone: serialized_sms['phone'], code: serialized_sms['code'], send_at: serialized_sms['send_at'])
Rails.logger.debug " sms = #{sms.inspect}, serialized_sms=#{serialized_sms.inspect}"
    if sms
      sms.verify_sign_up_sms( permitted_params[:phone],permitted_params[:code])
    else
      flash[:notice] = "验证码错误"
      if request.xhr?
        render :js => "window.location = '#{root_path}';"
      else
        redirect_to root_path
      end
    end
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

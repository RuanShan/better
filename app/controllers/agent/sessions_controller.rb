class Agent::SessionsController < Devise::SessionsController
  layout "agent"

  skip_before_filter :verify_authenticity_token, :only => :create
  
  def create
    self.resource = warden.authenticate(auth_options)
    if resource.nil?
      @error_message = "邮箱和密码不匹配"
    else
      if resource.confirmed?
        set_flash_message!(:notice, :signed_in)
        sign_in(resource_name, resource)
        yield resource if block_given?
      else
        session.clear
        @error_message = "请通过审核以后再登录"
      end
    end
    render :new, resource: resource
  end
# before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end

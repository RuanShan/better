class SessionsController < Devise::SessionsController
  def create
    self.resource = warden.authenticate(auth_options)
    if resource.nil?
      @error_message = "邮箱和密码不匹配"
    else
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      yield resource if block_given?
    end
    render :new, resource: resource
  end

end

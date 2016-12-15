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

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    #set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    respond_to_on_destroy
  end

  private

  # Check if there is no signed in user before doing the sign out.
  #
  # If there is no signed in user, it will set the flash message and redirect
  # to the after_sign_out path.
  def verify_signed_out_user
    if all_signed_out?
      #set_flash_message! :notice, :already_signed_out

      respond_to_on_destroy
    end
  end
end

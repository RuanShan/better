class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  around_action :set_current_user
  before_action :configure_permitted_parameters, if: :devise_controller?


  protected
  def render_dialog( options={} )

    dialog_view = options[:dialog_view]
    dialog_view ||= params[:action]
    dialog_content_selector = "#modal .modal-content"
    render 'shared/dialog', locals:{ dialog_view: dialog_view, dialog_content_selector: dialog_content_selector }

  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def after_sign_in_path_for(resource)
    if resource.class == Administrator
      admin_root_path
    elsif resource.class == Broker
      agent_root_path
    else
      account_path
    end
  end

  def set_current_user
    Current.user = current_user if user_signed_in?
    yield
  ensure
    # to address the thread variable leak issues in Puma/Thin webserver
    Current.user = nil
  end

end

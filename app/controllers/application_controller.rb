class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  around_action :set_current_user
  before_action :configure_permitted_parameters, :config_broker, if: :devise_controller?


  protected
  def render_dialog( options={} )

    dialog_view = options[:dialog_view]
    dialog_view ||= params[:action]
    dialog_content_selector = "#modal .modal-content"
    render 'shared/dialog', locals:{ dialog_view: dialog_view, dialog_content_selector: dialog_content_selector }

  end

  def configure_permitted_parameters
    sign_up_keys = [:name]
    sign_up_keys << :parent_id if params["broker"].present?
    sign_up_keys << :broker_id if params["user"].present?
    devise_parameter_sanitizer.permit(:sign_up, keys: sign_up_keys)
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def config_broker
    if params["controller"]== "devise_invitable/registrations" && params["action"] == "create"
      broker_number = session["broker_number"]
      if broker_number.present?
        broker = Broker.find_by_number(broker_number)
        params["broker"]["parent_id"] = broker.id if params["broker"].present?
        params["user"]["broker_id"] = broker.id if params["user"].present?
      end
    end
  end

  def after_sign_in_path_for(resource)
    if resource.class == Administrator
      admin_root_path
    elsif resource.class == Broker
      agent_root_path
    else
      my_account_index_path
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

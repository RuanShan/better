class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  around_action :set_current_user
  before_action :configure_permitted_parameters, :config_inviter, if: :devise_controller?
  after_action :clear_inviter, if: :devise_controller?


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
    if params["user"].present?
      sign_up_keys << :broker_id
      sign_up_keys << :invited_by_id if session["inviter_id"].present?
    end
    devise_parameter_sanitizer.permit(:sign_up, keys: sign_up_keys)
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def config_inviter
    if params["controller"]== "devise_invitable/registrations"
      if params["action"] == "new"
        if params["inviter_id"].present?
          session["inviter_id"] = params["inviter_id"]
        end
      end
      if params["action"] == "create"
        broker_number = session["broker_number"]
        user_id = session["inviter_id"]
        if broker_number.present?
          broker = Broker.find_by_number(broker_number)
          if broker.present?
            params["broker"]["parent_id"] = broker.id if params["broker"].present?
            params["user"]["broker_id"] = broker.id if params["user"].present?
          end
        end
        if user_id.present?
          user = User.find(user_id)
          if user.present?
            if params["user"].present?
              params["user"]["invited_by_id"] = user.id
              params["user"]["broker_id"] = user.broker_id
            end
          end
        end
      end
    end
  end

  def clear_inviter
    if params["controller"]== "devise_invitable/registrations" && params["action"] == "create"
      if session["broker_number"].present?
        session.delete("broker_number")
      end
      if session["inviter_id"].present?
        session.delete("inviter_id")
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

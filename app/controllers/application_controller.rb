class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  around_action :set_current_user
  before_action :config_params, :configure_permitted_parameters, if: :devise_controller?
  after_action :clear_inviter, if: :devise_controller?


  protected
  def render_dialog( options={} )

    dialog_view = options[:dialog_view]
    dialog_view ||= params[:action]
    dialog_content_selector = "#modal .modal-content"
    render 'shared/dialog', locals:{ dialog_view: dialog_view, dialog_content_selector: dialog_content_selector }

  end

  def configure_permitted_parameters
    sign_up_keys = [:type, :last_name, :first_name, :country_code, :qq, :phone]
    if params["broker"].present?
      sign_up_keys += [:province, :city, :address, :id_number, :lang, :website, :id_front, :id_back,
        user_banks_attributes:[:payment_method_id, :name, :card_number, :address, :payee, :pay_memo, :card_front, :card_back]]
      sign_up_keys << :parent_id if session["broker_number"].present?
    end
    if params["user"].present?
      sign_up_keys << :birthday
      if params["user"] && params["affiliate"] == "1"
        broker_number = params["user"]["broker_number"]
        broker = Broker.find_by_number(broker_number)
      end
      logger.debug "=================in application========broker=#{broker}"
      sign_up_keys << :broker_id if session["broker_number"].present? || broker
      sign_up_keys << :parent_id if session["inviter_number"].present?
      params["user"].delete("broker_number")
    end
    devise_parameter_sanitizer.permit(:sign_up, keys: sign_up_keys)
    #devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def config_params
    if params["controller"].split("/")[1] == "registrations"
      if params["action"] == "new"
        if params["inviter_number"].present?
          session["inviter_number"] = params["inviter_number"]
        end
      end
      if params["action"] == "create"
        if params["user"].present?
          params["user"]["type"] = "User"
        elsif params["broker"].present?
          params["broker"]["type"] = "Broker"
        end
        broker_number = params["user"].present? && params["user"]["broker_number"].present? ? params["user"]["broker_number"] : session["broker_number"]
        user_number = session["inviter_number"]
        if broker_number.present?
          broker = Broker.find_by_number(broker_number)
          if broker.present?
            params["broker"]["parent_id"] = broker.id if params["broker"].present?
            params["user"]["broker_id"] = broker.id if params["user"].present?
          end
        end

        if user_number.present?
          user = User.find_by_number(user_number)
          if user.present?
            #if user's session already have broker number, it will ignore user invite
            if params["user"].present? && params["user"]["broker_id"].blank?
              params["user"]["parent_id"] = user.id
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
      if session["inviter_number"].present?
        session.delete("inviter_number")
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

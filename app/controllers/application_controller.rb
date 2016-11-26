class ApplicationController < ActionController::Base
  include CommonHelper

  protect_from_forgery with: :exception
  #around_action :set_current_user
  before_action :config_params, :configure_permitted_parameters, if: :devise_controller?
  #注册失败时，不应删除邀请码，注册成功，session更新，
  #after_action :clear_inviter, if: :devise_controller?


  protected
  def render_dialog( options={} )

    dialog_view = options[:dialog_view]
    dialog_view ||= params[:action]
    dialog_content_selector = "#modal .modal-content"
    render 'shared/dialog', locals:{ dialog_view: dialog_view, dialog_content_selector: dialog_content_selector }

  end

  def configure_permitted_parameters
    sign_up_keys = []
    if params["broker"].present?
      sign_up_keys = [:type, :last_name, :first_name, :country_code, :qq, :phone, :province, :city, :address, :id_number, :lang, :website, :id_front, :id_back,
        user_banks_attributes:[:payment_method_id, :name, :card_number, :address, :payee, :pay_memo, :card_front, :card_back]]
      sign_up_keys << :parent_id if session["broker_number"].present? && params["broker"]["parent_id"].present?
    end
    devise_parameter_sanitizer.permit(:sign_up, keys: sign_up_keys)
    #devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def config_params
    if params["action"] == "create" && params["broker"].present?
      params["broker"]["type"] = "Broker"
      broker_number = session["broker_number"]
      if broker_number.present?
        broker = Broker.find_by_number(broker_number)
        if broker.present?
          params["broker"]["parent_id"] = broker.id
        end
      end
    end
  end

  def clear_inviter
    if params["controller"].split("/")[1] == "sessions" && params["action"] == "destroy"
      if session["broker_number"].present?
        session.delete("broker_number")
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


end

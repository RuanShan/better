module Agent
  class BaseController < ApplicationController

    layout "agent"

    def current_seller
      @current_seller ||= CurrentSeller.new( current_broker || current_user )
    end

    # for controller sale_days_controller, sale_months_controller
    def authenticate_seller!
      redirect_to root_path unless current_seller.present?
    end

    def select_layout_by_current_seller
      current_seller.is_user ? "agent_user" : "agent_broker"
    end
  end
end

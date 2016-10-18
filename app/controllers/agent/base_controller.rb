module Agent
  class BaseController < ApplicationController
    before_action :authenticate_broker!
    layout "agent"

    def current_user
      current_broker
    end

  end
end

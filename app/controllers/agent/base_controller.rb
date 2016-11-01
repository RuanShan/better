module Agent
  class BaseController < ApplicationController

    layout "agent"

    def current_user
      current_broker
    end

  end
end

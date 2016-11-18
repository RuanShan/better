class Agent::WelcomeController < Agent::BaseController
  layout "agent"
  
  def index
    if params["number"]
      broker = Broker.find_by_number(params["number"])
      if broker.present?
        session["broker_number"] = params["number"]
      end
    end
  end

end

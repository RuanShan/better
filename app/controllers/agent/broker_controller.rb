module Agent
  class BrokerController < BaseController
    layout "broker"
    before_action :authenticate_broker!

    def index
      @broker = current_broker
    end


    def show
      @broker = Broker.find(params[:id])
      unless current_broker.admin?
        unless @broker == current_broker
          redirect_to root_path, :alert => "Access denied."
        end
      end
    end

    def update
      @broker = Broker.find(params[:id])
      if @broker.update_attributes(secure_params)
        redirect_to brokers_path, :notice => "broker updated."
      else
        redirect_to brokers_path, :alert => "Unable to update broker."
      end
    end

    def destroy
      broker = Broker.find(params[:id])
      broker.destroy
      redirect_to brokers_path, :notice => "broker deleted."
    end

    def change_password
      if request.patch?
        current_broker.change_password(params["broker"])
        if current_broker.errors.empty?
          flash[:notice] = "Password changed!"
        else
          flash[:error] = current_broker.errors.full_messages[0]
        end
        redirect_to change_password_broker_path(current_broker)
      end
    end
  end
end

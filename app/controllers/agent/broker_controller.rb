module Agent
  class BrokerController < BaseController
    layout "agent_broker"
    before_action :authenticate_broker!

    def index
      @broker = current_broker
      @user_month = Summary::SaleMonthlyFactory.create("profit", @broker.member_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
      @user_day = Summary::BrokerDailyProfitFactory.create( @broker.member_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
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
      @selected_password = params["selected_password"] ? params["selected_password"] : "login"
      if request.patch?
        @selected_password = params["broker"]["password"] ? "login" : "money"
        broker_params = @selected_password == "login" ? login_password_params : money_password_params
        current_broker.change_password(broker_params)
      end
    end

    private

    def login_password_params
      params.require(:broker).permit(:current_password, :password, :password_confirmation)
    end

    def money_password_params
      params.require("broker").permit(:current_money_password, :money_password, :money_password_confirmation)
    end

  end
end

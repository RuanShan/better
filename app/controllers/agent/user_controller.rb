module Agent
  class UserController < BaseController
    layout "agent_user"
    before_action :authenticate_user!

    def index
      @broker = current_user
      @user_month = Summary::SaleMonthlyFactory.create("profit", current_broker.user_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
      @user_day = Summary::BrokerDailyProfitFactory.create( current_broker.user_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
    end


  end
end

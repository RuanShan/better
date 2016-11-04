module Agent
  class MembersController < BaseController
    layout "broker"
    before_action :authenticate_broker!

    def profit
      @users = current_broker.members.includes( :user_today, :user_life).paginate( page: params[:page] )
      @from_date = nil
      @to_date = DateTime.current.to_date

      search_params = permitted_search_params
      if search_params.present?
        to_date = DateTime.parse( search_params[:to_date] ).to_date
        from_date = DateTime.parse( search_params[:from_date] ).to_date
      end
      @member_profit_summaries = Summary::BrokerMemberProfitFactory.create(@users, @from_date, @to_date )
    end


    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

  end
end

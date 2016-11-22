module Agent
  class MembersController < BaseController
    layout "agent_broker"
    before_action :authenticate_broker!

    def index
      @member_type = params["user_type"].present? ? params["user_type"] : "all"
      @member_state = params["user_state"].present? ? params["user_state"] : "all"
      if @member_state == "all"
        state_condition = ""
      else
        state_condition = @member_state == "normal" ? "locked_at is NULL" : "locked_at is not NULL"
      end
      @users = current_broker.members.where(state_condition).paginate( page: params[:page] )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t @member_type.to_sym}#{t :member}#{t :state}#{t @member_state.to_sym}.xls"
          send_data @users.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def profit
      @users = current_broker.members.includes( :user_today, :user_life).paginate( page: params[:page] )
      @start_date = nil
      @end_date = DateTime.current.to_date

      search_params = permitted_search_params
      if search_params.present?
        begin
          @end_date = DateTime.parse( search_params[:end_date] ).to_date
          @start_date = DateTime.parse( search_params[:start_date] ).to_date
        rescue ArgumentError
        end
      end
      @member_profit_summaries = Summary::BrokerMemberProfitFactory.create(@users, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :members_detail_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::MemberProfit.generate_csv(@member_profit_summaries, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

  end
end

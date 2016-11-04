module Agent
  class MembersController < BaseController
    layout "broker"
    before_action :authenticate_broker!

    def index
      @users = current_broker.members.paginate( page: params[:page] )
      excel_file_name = "member_list"
      respond_to do |format|
        format.html
        format.xls do
          headers["Content-disposition"] = 'inline;  filename="'+excel_file_name+'.xls"'
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
    end

    def export_excel
      @users = current_broker.members.paginate( page: params[:page] )
      excel_file_name = "member_list"
      respond_to do |format|
        format.xls do
          headers["Content-disposition"] = 'inline;  filename="#{excel_file_name}.xls"'
        end
      end

    end

    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

  end
end

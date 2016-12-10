module Agent
  class MembersController < BaseController
    layout :select_layout_by_current_seller

    before_action :authenticate_seller!

    def brokers
      @member_level = params["user_depth"].to_i
      @member_state = params["member_state"] || "all"
      q = current_seller.descendants.includes(:parent)

      if @member_level>0
        level = current_seller.depth + @member_level
        q = q.where( depth: level)
      else
        q = q.where( ["depth<=?", current_seller.depth + 6])
      end

      if @member_state != "all"
        q = q.unlocked if @member_state == "normal"
        q = q.locked if @member_state == "frozen"
      end

      @users = q.paginate( page: params[:page] )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t @member_type.to_sym}#{t :member}#{t :state}#{t @member_state.to_sym}.xls"
          send_data @users.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def index
      @member_type = params["user_type"].present? ? params["user_type"] : "all"
      @member_state = params["user_state"].present? ? params["user_state"] : "all"
      if @member_state == "all"
        state_condition = ""
      else
        state_condition = @member_state == "normal" ? "locked_at is NULL" : "locked_at is not NULL"
      end
      @users = current_seller.members.where(state_condition).paginate( page: params[:page] )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t @member_type.to_sym}#{t :member}#{t :state}#{t @member_state.to_sym}.xls"
          send_data @users.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def profit
      @users = current_seller.members.includes( :user_today, :user_life).paginate( page: params[:page] )
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

    def pingtai
    end
    
    def yilou
      #投注记录遗漏表
    end

    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

  end
end

module Agent
  class SaleMonthsController < BaseController
    layout :select_layout_by_current_seller

    before_action :authenticate_seller!
    before_action :set_children, only: [:children, :children_profit, :children_balance]

    def index
      @start_date, @end_date, @dates = get_paginated_dates
      @sale_months = current_seller.sale_months.where( effective_on: @dates ).order( effective_on: :desc )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data @sale_months.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def profit
      @start_date, @end_date, @dates = get_paginated_dates
      user_months = current_seller.broker? ? current_seller.member_months.where(effective_on: @dates ) : current_seller.descendant_months(@dates)
      @monthly_profits = Summary::SaleMonthlyFactory.create("profit", user_months )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_profit_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::SaleMonthlyProfit.generate_csv(@monthly_profits, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def balance
      @start_date, @end_date, @dates = get_paginated_dates
      user_months = current_seller.broker? ? current_seller.member_months.where(effective_on: @dates+[DateTime.parse(@start_date).to_date.advance( months: -1 )] ) : current_seller.descendant_months(@dates+[DateTime.parse(@start_date).to_date.advance( months: -1 )])
      @monthly_balances = Summary::SaleMonthlyFactory.create("balance", user_months, @dates )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_balance_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::SaleMonthlyBalance.generate_csv(@monthly_balances, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children
      @start_date, @end_date, @dates = get_paginated_dates
      @sale_months = Summary::Children::SaleMonthFactory.create("effection", @children_brokers, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::Children::SaleMonthEffection.generate_csv(@sale_months, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children_profit
      @start_date, @end_date, @dates = get_paginated_dates
      @month_profits = Summary::Children::SaleMonthFactory.create("profit", @children_brokers, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_profit_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::Children::SaleMonthProfit.generate_csv(@month_profits, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children_balance
      @start_date, @end_date, @dates = get_paginated_dates
      @month_balances = Summary::Children::SaleMonthFactory.create("balance", @children_brokers, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :monthly_balance_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::Children::SaleMonthBalance.generate_csv(@month_balances, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_sale_day
        @sale_day = SaleDay.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def sale_day_params
        params.require(:sale_day).permit(:broker_id, :effective_on, :clink_visits, :blink_visits, :user_count, :valuable_member_count, :engergetic_member_count)
      end

      def set_children
        @page = params["page"]
        @member_level = params["member_level"].to_i
        @member_level = 1 if @member_level>6 || @member_level<1
        @member_state = params["member_state"] || "all"
        level = current_seller.depth + @member_level
        if current_seller.broker?
          q = current_seller.descendants.includes(:parent).where(depth: level).confirmed
        else
          q = current_seller.descendants.includes(:parent).where(depth: level)
        end
        if @member_state != "all"
          q = q.unlocked if @member_state == "normal"
          q = q.locked if @member_state == "frozen"
        end
        @children_brokers = q.paginate(:page => @page)
      end

      def permitted_search_params
        params.permit(:start_date, :end_date)
      end

      def get_paginated_dates
        # 缺省查询日期
        to_date = DateTime.current.to_date
        from_date = to_date.advance( months: -9 )
        # 由于sale_day/user_day 和 日期不是一一对应， 所以需要按日期分页再查找。
        search_params = permitted_search_params
        if search_params.present?
          # 按选择日期分页
          begin
          to_date = DateTime.parse( search_params[:end_date]+"-1" ).to_date
          from_date = DateTime.parse( search_params[:start_date]+"-1" ).to_date
          rescue ArgumentError
          end
          #if to_date < from_date
        end
        dates = ((to_date.year * 12 + to_date.month) - (from_date.year * 12 + from_date.month)+1).to_i.times.map{|i|
            to_date.advance( months: -i ).beginning_of_month
        }
        dates = dates.paginate(:page => params["page"])
        [from_date.beginning_of_month.to_s, to_date.beginning_of_month.to_s, dates]
      end
    end
end

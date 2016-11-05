class Agent::BrokerMonthsController < ApplicationController
  layout "broker"
  before_action :authenticate_broker!

  def index
    @start_date, @end_date, @dates = get_paginated_dates
    @broker_months = current_broker.broker_months.where( effective_on: @dates ).order( effective_on: :desc )
    respond_to do |format|
      format.html
      format.xls do
        excel_file_name = "#{t :monthly_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
        send_data @broker_months.to_csv(col_sep: "\t"), filename: excel_file_name
      end
    end
  end

  def profit
    @start_date, @end_date, @dates = get_paginated_dates
    user_months = current_broker.user_months.where(effective_on: @dates )
    @monthly_profits = Summary::BrokerMonthlyFactory.create("profit", user_months )
    respond_to do |format|
      format.html
      format.xls do
        excel_file_name = "#{t :monthly_profit_table}#{@start_date}~#{@end_date}.xls"
        send_data Summary::BrokerMonthlyProfit.generate_csv(@monthly_profits, col_sep: "\t"), filename: excel_file_name
      end
    end
  end

  def balance
    @start_date, @end_date, @dates = get_paginated_dates
    user_months = current_broker.user_months.where(effective_on: @dates+[DateTime.parse(@start_date).to_date.advance( months: -1 )] )
    @monthly_balances = Summary::BrokerMonthlyFactory.create("balance", user_months, @dates )
    respond_to do |format|
      format.html
      format.xls do
        excel_file_name = "#{t :monthly_balance_table}#{@start_date}~#{@end_date}.xls"
        send_data Summary::BrokerMonthlyBalance.generate_csv(@monthly_balances, col_sep: "\t"), filename: excel_file_name
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_broker_day
      @broker_day = BrokerDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def broker_day_params
      params.require(:broker_day).permit(:broker_id, :effective_on, :clink_visits, :blink_visits, :user_count, :valuable_member_count, :engergetic_member_count)
    end

    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

    def get_paginated_dates
      # 缺省查询日期
      to_date = DateTime.current.to_date
      from_date = to_date.advance( months: -9 )
      # 由于broker_day/user_day 和 日期不是一一对应， 所以需要按日期分页再查找。
      search_params = permitted_search_params
      if search_params.present?
        # 按选择日期分页
        begin
        to_date = DateTime.parse( search_params[:end_date] ).to_date
        from_date = DateTime.parse( search_params[:start_date] ).to_date
        rescue ArgumentError
        end
        #if to_date < from_date
      end
      dates = ((to_date.year * 12 + to_date.month) - (from_date.year * 12 + from_date.month)+1).to_i.times.map{|i|
          to_date.advance( months: -i )
      }
      dates = dates.paginate(:page => params["page"])
      [from_date.to_s, to_date.to_s, dates]
    end

end

module Admin
  class ReportsController < BaseController

    def daily_profits
      @page = params['page'] || 1
      @start_date, @end_date, @dates = get_paginated_dates
      @broker = Broker.find(params[:broker_id]) if params[:broker_id].present? && params[:broker_id].to_i > 0
      if @broker.present?
        user_days = @broker.member_days.where(effective_on: @dates)
        @daily_profits = Summary::BrokerDailyProfitFactory.create( user_days )
      else
        @broker_days = UserDay.where(effective_on: @dates).group(:broker_id, :effective_on).order(:effective_on).paginate(:page => params["page"])
        @daily_profits = []
        @broker_days.each{|broker_day| @daily_profits += Summary::BrokerDailyProfitFactory.create( broker_day.broker_days )}
      end
      @bid_sum = UserDay.where(effective_on: @dates).sum(:bid_amount)
      @net_sum = UserDay.where(effective_on: @dates).sum("drawing_amount + balance - deposit_amount")
    end

    def broker_user_days
      @page = params['page'] || 1
      @date = params[:date] || DateTime.current.to_date
      @broker = Broker.find(params[:broker_id]) if params[:broker_id].present? && params[:broker_id].to_i > 0
      @user_days = @broker.present? ? @broker.member_days.where(effective_on: @date).paginate(:page => params["page"]) : UserDay.where(effective_on: @date).paginate(:page => params["page"])
    end

    def monthly_profits
      @page = params['page'] || 1
      @start_date, @end_date, @dates = get_paginated_months
      @broker = Broker.find(params[:broker_id]) if params[:broker_id].present? && params[:broker_id].to_i > 0
      if @broker.present?
        user_months = @broker.member_months.where(effective_on: @dates)
        @monthly_profits = Summary::SaleMonthlyFactory.create("profit", user_months )
      else
        @broker_months = UserMonth.where(effective_on: @dates).group(:broker_id, :effective_on).order(:effective_on).paginate(:page => params["page"])
        @monthly_profits = []
        @broker_months.each{|broker_month| @monthly_profits += Summary::SaleMonthlyFactory.create( "profit", broker_month.broker_months )}
      end
      @bid_sum = UserMonth.where(effective_on: @dates).sum(:bid_amount)
      @net_sum = UserMonth.where(effective_on: @dates).sum("drawing_amount + balance - deposit_amount")
    end

    def broker_user_months
      @page = params['page'] || 1
      @date = params[:date] || DateTime.current.to_date
      @broker = Broker.find(params[:broker_id]) if params[:broker_id].present? && params[:broker_id].to_i > 0
      @user_months = @broker.present? ? @broker.member_months.where(effective_on: @date).paginate(:page => params["page"]) : UserMonth.where(broker_id:0, effective_on: @date).paginate(:page => params["page"])
    end

    private

    def permitted_search_params
      params.permit(:start_date, :end_date)
    end

    def get_paginated_dates
      # 缺省查询日期
      to_date = DateTime.current.to_date
      from_date = to_date
      # 由于sale_day/user_day 和 日期不是一一对应， 所以需要按日期分页再查找。
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
      dates = (to_date - from_date + 1).to_i.times.map{|i|
          to_date.advance( days: -i )
      }
      dates = dates.paginate(:page => params["page"])
      [from_date.to_s, to_date.to_s, dates]
    end

    def get_paginated_months
      # 缺省查询日期
      to_date = DateTime.current.to_date
      from_date = to_date
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

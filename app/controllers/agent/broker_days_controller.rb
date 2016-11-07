module Agent
  class BrokerDaysController < BaseController
    layout "broker"
    before_action :authenticate_broker!
    before_action :set_broker_day, only: [:show, :edit, :update, :destroy]
    before_action :set_children, only: [:children, :children_profit]

    # GET /broker_days
    # GET /broker_days.json
    # 日盈利表
    def index
      @start_date, @end_date, @dates = get_paginated_dates
      @broker_days = current_broker.broker_days.where( effective_on: @dates ).order( effective_on: :desc )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data @broker_days.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def profit
      #fields = "effective_on, count(*) as group_count, sum(deposit_amount) as deposit_amount,sum(drawing_amount) as drawing_amount,sum(bid_amount) as bid_amount,sum(bonus) as bonus"
      @start_date, @end_date, @dates = get_paginated_dates
      user_days = current_broker.user_days.where(effective_on: @dates )
      @daily_profits = Summary::BrokerDailyProfitFactory.create( user_days )
      #@grouped_user_days = current_broker.user_days.select( fields ).where(effective_on: @dates ).group(:broker_id, :effective_on)
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_profit_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::BrokerDailyProfit.generate_csv(@daily_profits, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children
      @start_date, @end_date, @dates = get_paginated_dates
      @broker_days = Summary::Children::BrokerDayFactory.create("effection", @children_brokers, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::Children::BrokerDayEffection.generate_csv(@broker_days, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children_profit
      @start_date, @end_date, @dates = get_paginated_dates
      @day_profits = Summary::Children::BrokerDayFactory.create("profit", @children_brokers, @start_date, @end_date )
      Rails.logger.debug "in children_profit , @day_profits=#{@day_profits.inspect}"

      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_profit_table}#{@start_date}~#{@end_date}.xls"
          Rails.logger.debug "in children_profit , before send xls, @day_profits=#{@day_profits.inspect}"
          send_data Summary::Children::BrokerDayProfit.generate_csv(@day_profits, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    # GET /broker_days/1
    # GET /broker_days/1.json
    def show
    end

    # GET /broker_days/new
    def new
      @broker_day = BrokerDay.new
    end

    # GET /broker_days/1/edit
    def edit
    end

    # POST /broker_days
    # POST /broker_days.json
    def create
      @broker_day = BrokerDay.new(broker_day_params)

      respond_to do |format|
        if @broker_day.save
          format.html { redirect_to @broker_day, notice: 'Broker day was successfully created.' }
          format.json { render :show, status: :created, location: @broker_day }
        else
          format.html { render :new }
          format.json { render json: @broker_day.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /broker_days/1
    # PATCH/PUT /broker_days/1.json
    def update
      respond_to do |format|
        if @broker_day.update(broker_day_params)
          format.html { redirect_to @broker_day, notice: 'Broker day was successfully updated.' }
          format.json { render :show, status: :ok, location: @broker_day }
        else
          format.html { render :edit }
          format.json { render json: @broker_day.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /broker_days/1
    # DELETE /broker_days/1.json
    def destroy
      @broker_day.destroy
      respond_to do |format|
        format.html { redirect_to broker_days_url, notice: 'Broker day was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_broker_day
        @broker_day = BrokerDay.find(params[:id])
      end

      def set_children
        @page = params["page"]
        @member_state = params["member_state"] || "all"
        if @member_state == "all"
          state_condition = ""
        else
          state_condition = @member_state == "normal" ? "and locked_at is NULL" : "and locked_at is not NULL"
        end
        @children_brokers = current_broker.filtered_children(state_condition).paginate(:page => @page)
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
        from_date = to_date.advance( days: -9 )
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
        dates = (to_date - from_date + 1).to_i.times.map{|i|
            to_date.advance( days: -i )
        }
        dates = dates.paginate(:page => params["page"])
        [from_date.to_s, to_date.to_s, dates]
      end
  end
end

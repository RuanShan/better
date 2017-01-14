module Agent
  class SaleDaysController < BaseController
    layout :select_layout_by_current_seller

    before_action :authenticate_seller!
    before_action :set_sale_day, only: [:show, :edit, :update, :destroy]
    before_action :set_children, only: [:children, :children_profit]

    # GET /sale_days
    # GET /sale_days.json
    # 日盈利表
    def index
      @start_date, @end_date, @dates = get_paginated_dates
      @sale_days = current_seller.sale_days.where( effective_on: @dates ).order( effective_on: :desc )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data @sale_days.to_csv(col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def profit
      #fields = "effective_on, count(*) as group_count, sum(deposit_amount) as deposit_amount,sum(drawing_amount) as drawing_amount,sum(bid_amount) as bid_amount,sum(bonus) as bonus"
      @start_date, @end_date, @dates = get_paginated_dates
      member_days = current_seller.member_days.where(effective_on: @dates )
      @daily_profits = Summary::BrokerDailyProfitFactory.create( member_days )

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
      @sale_days = Summary::Children::SaleDayFactory.create("effection", @children_brokers, @start_date, @end_date )
      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_promotional_effectiveness_table}#{@start_date}~#{@end_date}.xls"
          send_data Summary::Children::SaleDayEffection.generate_csv(@sale_days, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    def children_profit
      @start_date, @end_date, @dates = get_paginated_dates
      @day_profits = Summary::Children::SaleDayFactory.create("profit", @children_brokers, @start_date, @end_date )
      Rails.logger.debug "in children_profit , @day_profits=#{@day_profits.inspect}"

      respond_to do |format|
        format.html
        format.xls do
          excel_file_name = "#{t :daily_profit_table}#{@start_date}~#{@end_date}.xls"
          Rails.logger.debug "in children_profit , before send xls, @day_profits=#{@day_profits.inspect}"
          send_data Summary::Children::SaleDayProfit.generate_csv(@day_profits, col_sep: "\t"), filename: excel_file_name
        end
      end
    end

    # GET /sale_days/1
    # GET /sale_days/1.json
    def show
    end

    # GET /sale_days/new
    def new
      @sale_day = SaleDay.new
    end

    # GET /sale_days/1/edit
    def edit
    end

    # POST /sale_days
    # POST /sale_days.json
    def create
      @sale_day = SaleDay.new(sale_day_params)

      respond_to do |format|
        if @sale_day.save
          format.html { redirect_to @sale_day, notice: 'Broker day was successfully created.' }
          format.json { render :show, status: :created, location: @sale_day }
        else
          format.html { render :new }
          format.json { render json: @sale_day.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /sale_days/1
    # PATCH/PUT /sale_days/1.json
    def update
      respond_to do |format|
        if @sale_day.update(sale_day_params)
          format.html { redirect_to @sale_day, notice: 'Broker day was successfully updated.' }
          format.json { render :show, status: :ok, location: @sale_day }
        else
          format.html { render :edit }
          format.json { render json: @sale_day.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /sale_days/1
    # DELETE /sale_days/1.json
    def destroy
      @sale_day.destroy
      respond_to do |format|
        format.html { redirect_to sale_days_url, notice: 'Broker day was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_sale_day
        @sale_day = SaleDay.find(params[:id])
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
      # Never trust parameters from the scary internet, only allow the white list through.
      def sale_day_params
        params.require(:sale_day).permit(:broker_id, :effective_on, :clink_visits, :blink_visits, :user_count, :valuable_member_count, :engergetic_member_count)
      end

      def permitted_search_params
        params.permit(:start_date, :end_date)
      end

      def get_paginated_dates
        # 缺省查询日期
        to_date = DateTime.current.to_date
        from_date = to_date.advance( days: -9 )
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
  end
end

module Agent
  class BrokerDaysController < BaseController
    layout "broker"
    before_action :authenticate_broker!
    before_action :set_broker_day, only: [:show, :edit, :update, :destroy]

    # GET /broker_days
    # GET /broker_days.json
    # 日盈利表
    def index

      @dates = get_paginated_dates

      @broker_days = current_broker.broker_days.where( effective_on: @dates ).order( effective_on: :desc )
    end

    def profit
      #fields = "effective_on, count(*) as group_count, sum(deposit_amount) as deposit_amount,sum(drawing_amount) as drawing_amount,sum(bid_amount) as bid_amount,sum(bonus_amount) as bonus_amount"
      @dates = get_paginated_dates
      user_days = current_broker.user_days.where(effective_on: @dates )
      @daily_profits = Summary::BrokerDailyProfitFactory.create( user_days )
      #@grouped_user_days = current_broker.user_days.select( fields ).where(effective_on: @dates ).group(:broker_id, :effective_on)
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
        from_date = to_date.advance( days: -10 )
        # 由于broker_day/user_day 和 日期不是一一对应， 所以需要按日期分页再查找。
        search_params = permitted_search_params
        if search_params.present?
          # 按选择日期分页
          to_date = DateTime.parse( search_params[:to_date] ).to_date
          from_date = DateTime.parse( search_params[:from_date] ).to_date
          #if to_date < from_date
        end
        dates = (to_date - from_date).to_i.times.map{|i|
            to_date.advance( days: -i )
        }
        dates = dates.paginate(:page => params["page"])
      end
  end
end

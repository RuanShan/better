module My
  class BidsController < BaseController

    before_action :set_bid, only: [:show, :edit, :update, :destroy]
    skip_before_action :customer_authenticate_user!, only: [:simulate, :simulate_update]
    # GET /bids
    # GET /bids.json
    def index
      @page = params["page"]
      @bid_sum = current_user.life_statis.bid_amount > 0 ? current_user.life_statis.bid_amount : Bid.where("user_id=?",current_user.id).all.sum(:amount)
      @net_sum = current_user.life_statis.net > 0 ? current_user.life_statis.net : Bid.where("user_id=?",current_user.id).all.inject(0){|sum,bid|sum+=bid.net_amount}
      @bids = Bid.where("user_id=?",current_user.id).all.paginate(:page => @page)
    end

    # GET /bids/1
    # GET /bids/1.json
    def show
    end

    # GET /bids/new
    def new
      @bid = Bid.new
    end

    # GET /bids/1/edit
    def edit
    end

    # POST /bids
    # POST /bids.json
    def create
      @game_round = GameRound.where(game_round_params).first || GameRound.new( game_round_params)
      #Rails.logger.debug " @game_round=#{@game_round.inspect}"
      #Rails.logger.debug " game_round=#{GameRound.last.inspect}"
      #@game_round.custom_highlow = 1
      @bid = current_user.bids.build(bid_params)
      @bid.game_round = @game_round
      @bid.rate = @game_round.game_instrument.default_rate
      #@bid.last_quote = 0
      respond_to do |format|
        if @bid.save
          format.html { redirect_to @bid, notice: 'Bid was successfully created.' }
          format.json { render :show, status: :created, location: @bid }
          format.js { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @bid.errors, status: :unprocessable_entity }
          format.js { render :failure, status: :created }
        end
      end
    end

    # PATCH/PUT /bids/1
    # PATCH/PUT /bids/1.json
    def update
      respond_to do |format|

        Rails.logger.debug " bid update #{DateTime.current}"

        game_round = @bid.game_round
        unless @bid.game_round.success?
          if game_round.time_to_close?
            @bid.complete_game_round(params["quote"])
          end
        end
        if true
          format.js { render :show, status: :updated }
          format.html { redirect_to @bid, notice: 'Bid was successfully updated.' }
          format.json { render :show, status: :ok, location: @bid }
        else
          format.html { render :edit }
          format.json { render json: @bid.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /bids/1
    # DELETE /bids/1.json
    def destroy
      @bid.destroy
      respond_to do |format|
        format.html { redirect_to bids_url, notice: 'Bid was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def search
      @page = params["page"]
      @start_date = search_params[:start_date]
      @end_date = search_params[:end_date]
      @game_instrument = search_params[:game_id]
      all_bids = Bid.search(search_params, current_user.id)
      @bid_sum = all_bids.sum(:amount)
      @net_sum = all_bids.inject(0){|sum,bid|sum+=bid.net_amount}
      logger.debug "@bid_sum=#{@bid_sum}"
      @bids = all_bids.paginate(:page => @page)
      render :index
    end

    def simulate
      @game_round = GameRound.find_or_initialize_by game_round_params

      @bid = Bid.new(bid_params)
      @bid.game_round = @game_round

      respond_to do |format|
        if @bid.save_with_simulator(session)
          format.html { redirect_to @bid, notice: 'Bid was successfully created.' }
          format.json { render :show, status: :created, location: @bid }
          format.js { render :show, status: :created }
        else
        format.html { render :new }
          format.json { render json: @bid.errors, status: :unprocessable_entity }
          format.js { render :show, status: :created }
        end
      end

    end

    def simulate_update
      respond_to do |format|
        if update_quote
          format.js { render :show, status: :updated }
          format.html { redirect_to @bid, notice: 'Bid was successfully updated.' }
          format.json { render :show, status: :ok, location: @bid }
        else
          format.html { render :edit }
          format.json { render json: @bid.errors, status: :unprocessable_entity }
        end
      end
    end

    private

      def update_quote
        @bid = Bid.new(session["sbid"])
        game_round = GameRound.new(session["sgame_round"])
        logger.debug "bid=#{@bid.inspect}"
        logger.debug "game_round=#{game_round.inspect}"
        quote, hack_quote = RedisService.get_quote_by_time(game_round.instrument_code, game_round.end_at.to_datetime)
        quote ||= params["quote"].to_f
        logger.debug "quote=#{quote}"
        hight_win = (quote - @bid["last_quote"].to_f > 0) && @bid["highlow"].to_i == 1
        low_win = (quote - @bid["last_quote"].to_f < 0) && @bid["highlow"].to_i == 0
        @bid.state = hight_win || low_win ? "win" : "lose"
        game_round.instrument_quote = quote
        @bid.game_round = game_round
      end
      # Use callbacks to share common setup or constraints between actions.
      def set_bid
        @bid = Bid.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def bid_params
        params.require(:bid).permit(:game_round_id, :user_id, :amount, :rate, :highlow, :last_quote)
      end

      def game_round_params
        permitted_params = params.require(:game_round).permit(:instrument_code, :start_at, :period, :game_id )
        #permitted_params[:start_at] "2017-01-12T06:28:00.219Z" => time_with_zone
        # or can not find record by condition ["start_at", "2017-01-12T06:28:00.219Z"]
        permitted_params[:start_at] = Time.zone.parse(permitted_params[:start_at])
        permitted_params
      end

      def search_params
        params.permit(:start_date, :end_date, :game_id)
      end
  end
end

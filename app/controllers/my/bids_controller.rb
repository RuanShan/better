module My
  class BidsController < BaseController

    before_action :set_bid, only: [:show, :edit, :update, :destroy]

    # GET /bids
    # GET /bids.json
    def index
      @page = params["page"]
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
      @game_round = GameRound.find_or_initialize_by game_round_params

      @bid = current_user.bids.build(bid_params)
      @bid.game_round = @game_round

      respond_to do |format|
        if @bid.save
          format.html { redirect_to @bid, notice: 'Bid was successfully created.' }
          format.json { render :show, status: :created, location: @bid }
          format.js { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @bid.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /bids/1
    # PATCH/PUT /bids/1.json
    def update
      respond_to do |format|
        if @bid.update(bid_params)
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
      @platform = search_params[:game_id]
      @bids = Bid.search(search_params, current_user.id).paginate(:page => @page)
      render :index
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_bid
        @bid = Bid.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def bid_params
        params.require(:bid).permit(:game_round_id, :user_id, :amount, :rate, :highlow, :last_quote)
      end

      def game_round_params
        params.require(:game_round).permit(:instrument_code, :start_at, :period )
      end

      def search_params
        params.permit(:start_date, :end_date, :game_id)
      end
  end
end

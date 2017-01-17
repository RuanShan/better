module Admin
  class GameRoundsController < BaseController
    before_action :set_game_round, only: [:show, :edit, :update, :destroy]

    # GET /game_rounds
    # GET /game_rounds.json
    def index
      @page = params['page'] || 1
      #.with_state(:pending)
      @game_rounds = GameRound.where(["(state=? OR state=?  OR (state=? AND bid_count>0))",:pending,:started,:success]).includes(:bids).order("start_at desc").paginate(:page => @page)

    end

    # GET /game_rounds/1
    # GET /game_rounds/1.json
    def show
    end

    # GET /game_rounds/new
    def new
      @game_round = GameRound.new
    end

    # GET /game_rounds/1/edit
    def edit
    end

    # POST /game_rounds
    # POST /game_rounds.json
    def create
      @game_round = GameRound.new(game_round_params)

      respond_to do |format|
        if @game_round.save
          format.html { redirect_to @game_round, notice: 'Game round was successfully created.' }
          format.json { render :show, status: :created, location: @game_round }
        else
          format.html { render :new }
          format.json { render json: @game_round.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /game_rounds/1
    # PATCH/PUT /game_rounds/1.json
    def update
      respond_to do |format|
        if @game_round.update(game_round_params)

          if @game_round.started? && @game_round.previous_changes.key?( 'custom_highlow')
            RedisService.custom_game_ground_winlose @game_round
          end

          format.html { redirect_to action: :index, notice: 'Game round was successfully updated.' }
          format.json { render :show, status: :ok, location: @game_round }
        else
          format.html { render :edit }
          format.json { render json: @game_round.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /game_rounds/1
    # DELETE /game_rounds/1.json
    def destroy
      @game_round.destroy
      respond_to do |format|
        format.html { redirect_to game_rounds_url, notice: 'Game round was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_game_round
        @game_round = GameRound.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def game_round_params
        params.require(:game_round).permit(:instrument_code, :start_at, :end_at, :period, :custom_highlow )
      end
  end
end

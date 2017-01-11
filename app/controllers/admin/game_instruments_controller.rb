module Admin

  class GameInstrumentsController < BaseController
    before_action :set_game_instrument, only: [:show, :edit, :update, :destroy]

    def index
      @page = params['page'] || 1
      @game_instruments = GameInstrument.order("created_at desc").all.paginate(:page => @page, :per_page => 12)
    end

    def show

    end

    def search
      @page = params["page"]
      @category_id = params[:category_id]
      if @category_id.present?
        @game_instruments = GameInstrument.where("category_id=?",@category_id).order("created_at desc").paginate(:page => @page)
        render :index
      else
        redirect_to admin_game_instruments_path
      end
    end

    def batch_rate
      rate = params["default_rate"]
      GameInstrument.all.each{|gi|
        gi.default_rate = rate
        gi.save
      }
      redirect_to admin_game_instruments_path
    end

    # GET /game_instruments/new
    def new
      @game_instrument = GameInstrument.new
    end

    # GET /game_instruments/1/edit
    def edit
    end

    # POST /game_instruments
    # POST /game_instruments.json
    def create
      @game_instrument = GameInstrument.new(game_instrument_params)

      respond_to do |format|
        if @game_instrument.save
          format.html { redirect_to action: :index, notice: 'Game instrument was successfully created.' }
          format.json { render :show, status: :created, location: @game_instrument }
        else
          format.html { render :new }
          format.json { render json: @game_instrument.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /game_instruments/1
    # PATCH/PUT /game_instruments/1.json
    def update
      respond_to do |format|
        if @game_instrument.update(game_instrument_params)
          format.html { redirect_to action: :index, notice: 'Game instrument was successfully updated.' }
          format.json { render :show, status: :ok, location: @game_instrument }
        else
          format.html { render :edit }
          format.json { render json: @game_instrument.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /game_instruments/1
    # DELETE /game_instruments/1.json
    def destroy
      @game_instrument.destroy
      respond_to do |format|
        format.html { redirect_to action: :index, notice: 'Game instrument was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_game_instrument
        @game_instrument = GameInstrument.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def game_instrument_params
        params.require(:game_instrument).permit(:name, :code, :description, :hot, :default_rate, :decimal)
      end
  end
end

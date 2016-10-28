module My
  class WalletsController < BaseController
    before_action :set_wallet, only: [:show, :edit, :update, :destroy]

    # GET /wallets
    # GET /wallets.json
    def index
      @wallets = UserWallet.all
    end

    # GET /wallets/1
    # GET /wallets/1.json
    def show
    end

    # GET /wallets/new
    def new
      @wallet = UserWallet.new
    end

    # GET /wallets/1/edit
    def edit
    end

    # POST /wallets
    # POST /wallets.json
    def create
      @wallet = UserWallet.new(wallet_params)

      respond_to do |format|
        if @wallet.save
          format.html { redirect_to @wallet, notice: 'User wallet was successfully created.' }
          format.json { render :show, status: :created, location: @wallet }
        else
          format.html { render :new }
          format.json { render json: @wallet.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /wallets/1
    # PATCH/PUT /wallets/1.json
    def update
      respond_to do |format|
        if @wallet.update(wallet_params)
          format.html { redirect_to @wallet, notice: 'User wallet was successfully updated.' }
          format.json { render :show, status: :ok, location: @wallet }
        else
          format.html { render :edit }
          format.json { render json: @wallet.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /wallets/1
    # DELETE /wallets/1.json
    def destroy
      @wallet.destroy
      respond_to do |format|
        format.html { redirect_to wallets_url, notice: 'User wallet was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def bonuses
      @page = params["page"]
      @bonuses = Wallet.bonuses.order("created_at desc").all.paginate(:page => @page)
    end

    def search_bonuses
      @page = params["page"]
      @start_date = bonus_search_params[:start_date]
      @end_date = bonus_search_params[:end_date]
      @bonuses = Wallet.search_bonuses(bonus_search_params).paginate(:page => @page)
      render :bonuses
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_wallet
        @wallet = UserWallet.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def wallet_params
        params.require(:wallet).permit(:user_id, :amount, :memo, :deleted_at)
      end

      def bonus_search_params
        params.permit(:start_date, :end_date)
      end
  end

end

module Admin
  class BidsController < BaseController
    before_action :set_bid, only: [:show, :edit, :update, :destroy, :pass]

    # GET /bids
    # GET /bids.json
    def index
      @bids = Bid.includes(:user, :game_round).order(created_at: :desc).paginate(:page => params[:page])
      respond_to do |format|
        format.html
        format.csv do
          csv_file_name = "bid_records.csv"
          send_data Bid.generate_csv(@bids, col_sep: ","), filename: csv_file_name
        end
      end
    end

    # GET /bids/1
    # GET /bids/1.json
    def show
    end



    # GET /bids/1/edit
    def edit
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

    def export
    end

    def pass
      @page = params['page']

      @bid.process!

      redirect_to action: :index, page: @page
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_bid
        @bid = Bid.find(params[:id])
      end

      def build_depoist

      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def bid_params
        params.require(:bid).permit(:payment_method_id, :user_id, :amount, :memo)
      end

  end
end

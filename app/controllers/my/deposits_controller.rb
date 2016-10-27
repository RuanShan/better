module My
  class DepositsController < BaseController
    before_action :set_deposit, only: [:show, :edit, :update, :destroy]

    # GET /deposits
    # GET /deposits.json
    def index
      @page = params["page"]
      @user = current_user
      @deposits = Deposit.order("created_at desc").all.paginate(:page => @page)
    end

    # GET /deposits/1
    # GET /deposits/1.json
    def show
    end

    # GET /deposits/new
    def new
      @user = current_user
      @deposit = Deposit.new
    end

    # GET /deposits/1/edit
    def edit
    end

    # POST /deposits
    # POST /deposits.json
    def create
      @deposit = Deposit.new(deposit_params)
      @deposit.user = current_user

      respond_to do |format|
        if @deposit.save
          format.html { redirect_to @deposit, notice: 'Deposit was successfully created.' }
          format.json { render :show, status: :created, location: @deposit }
          format.js { redirect_to action: 'index', status: 303 }
          #format.js{ render_dialog dialog_view: 'wait_gateway_response' }
        else
          @model = @deposit
          format.html { render :new }
          format.json { render json: @deposit.errors, status: :unprocessable_entity }
          format.js{ render_dialog  dialog_view: 'shared/model_errors' }
        end
      end
    end

    # PATCH/PUT /deposits/1
    # PATCH/PUT /deposits/1.json
    def update
      respond_to do |format|
        if @deposit.update(deposit_params)
          format.html { redirect_to @deposit, notice: 'Deposit was successfully updated.' }
          format.json { render :show, status: :ok, location: @deposit }
        else
          format.html { render :edit }
          format.json { render json: @deposit.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /deposits/1
    # DELETE /deposits/1.json
    def destroy
      @deposit.destroy
      respond_to do |format|
        format.html { redirect_to deposits_url, notice: 'Deposit was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def search
      @page = params["page"]
      @search = true
      @deposits = Deposit.search(search_params).paginate(:page => @page)
      render 'shared/partials', locals:{ partial_hash: {"#deposit_records"=>"records"} }
    end


    private
      # Use callbacks to share common setup or constraints between actions.
      def set_deposit
        @deposit = Deposit.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def deposit_params
        params.require(:deposit).permit(:payment_method_id, :user_id, :amount, :state)
      end

      def search_params
        params.permit(:start_date, :end_date, :state)
      end
  end
end

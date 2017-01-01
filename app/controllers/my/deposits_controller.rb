module My
  class DepositsController < BaseController
    before_action :set_deposit, only: [:show, :edit, :update, :destroy]

    # GET /deposits
    # GET /deposits.json
    def index
      @page = params["page"]
      @user = current_user
      @deposits = Deposit.where("user_id=?",current_user.id).order("created_at desc").all.paginate(:page => @page)
    end

    # GET /deposits/1
    # GET /deposits/1.json
    def show
    end

    # GET /deposits/new
    def new
      @deposit = Deposit.new
    end

    def domestic_new
      @user = current_user
      @deposit = Deposit.new
    end

    def foreign_new
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

      @deposit.do_with_promotion

      respond_to do |format|
        if @deposit.errors.empty?
          @iss_ins_cd = params['iss_ins_cd'] || '0000000000'
          @url = Gateway::Fuiou::Service.create_pc_url( order_id: @deposit.number, order_amt: @deposit.amount_in_cent, iss_ins_cd:  @iss_ins_cd)
          @md5 = Gateway::Fuiou::Service.create_sign_string(  order_id: @deposit.number, order_amt: @deposit.amount_in_cent, iss_ins_cd: @iss_ins_cd )

          format.html { render :goto_gateway2, layout: false, notice: t(:deposit_success) }
          format.json { render :show, status: :created, location: @deposit }
          format.js { redirect_to action: 'index', status: 303 }
          #format.js{ render_dialog dialog_view: 'wait_gateway_response' }
        else
          Rails.logger.debug "@deposit.errors=#{@deposit.errors.inspect}"
          #@model = @deposit
          format.html { render :new }
          format.json { render json: @deposit.errors, status: :unprocessable_entity }
          #format.js{ render_dialog  dialog_view: 'shared/model_errors' }
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
      @start_date = search_params[:start_date]
      @end_date = search_params[:end_date]
      @state = search_params[:state]
      @deposits = Deposit.search(search_params, current_user.id).paginate(:page => @page)
      render :index
    end


    private
      # Use callbacks to share common setup or constraints between actions.
      def set_deposit
        @deposit = Deposit.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def deposit_params
        params.require(:deposit).permit(:payment_method_id, :iss_ins_cd, :user_id, :amount, :promotion_number)
      end

      def search_params
        params.permit(:start_date, :end_date, :state)
      end
  end
end

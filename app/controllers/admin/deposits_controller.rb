module Admin
  class DepositsController < BaseController
    before_action :set_deposit, only: [:show, :edit, :update, :destroy, :pass]

    # GET /deposits
    # GET /deposits.json
    def index
      @deposits = Deposit.order(created_at: :desc).all.paginate(:page => params[:page])
      respond_to do |format|
        format.html
        format.csv do
          csv_file_name = "deposit_records.csv"
          send_data Deposit.generate_csv(@deposits, col_sep: ","), filename: csv_file_name
        end
      end
    end

    # GET /deposits/1
    # GET /deposits/1.json
    def show
    end

    # GET /deposits/new
    def new
      user = User.find_by_number(params["user_number"])
      @deposit = user.deposits.build
    end

    # GET /deposits/1/edit
    def edit
    end

    # POST /deposits
    # POST /deposits.json
    def create
      @deposit = Deposit.new(deposit_params)
      @deposit.payment_method = PaymentMethod.find_by_name("内部充值")
      @deposit.administrator = current_administrator

      respond_to do |format|
        if @deposit.save
          format.html {
            redirect_to record_admin_user_path(@deposit.user, record_for: 'deposit')
            #redirect_to @deposit, notice: 'Deposit was successfully created.'
          }
          format.json { render :show, status: :created, location: @deposit }
        else
          format.html { render :new }
          format.json { render json: @deposit.errors, status: :unprocessable_entity }
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

    def export
    end

    def pass
      @page = params['page']

      @deposit.process!

      redirect_to action: :index, page: @page
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_deposit
        @deposit = Deposit.find(params[:id])
      end

      def build_depoist

      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def deposit_params
        params.require(:deposit).permit(:payment_method_id, :user_id, :amount, :memo)
      end

  end
end

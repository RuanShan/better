module My
  class DrawingsController < BaseController

    before_action :set_drawing, only: [:show, :edit, :update, :destroy]

    # GET /drawings
    # GET /drawings.json
    def index
      @page = params["page"]
      @drawings = Drawing.order("created_at desc").all.paginate(:page => @page)
    end

    # GET /drawings/1
    # GET /drawings/1.json
    def show
    end

    # GET /drawings/new
    def new
      @user_banks = current_user.user_banks.green
      @drawing = Drawing.new
      @drawing.user_bank = @user_banks.present? ? @user_banks.first : UserBank.new
    end

    # GET /drawings/1/edit
    def edit
    end

    # POST /drawings
    # POST /drawings.json
    def create
      @user_banks = current_user.user_banks.green
      @drawing = current_user.drawing(drawing_params.to_h)
      respond_to do |format|
        if @drawing.user_bank.errors.empty? && @drawing.errors.empty?
          format.html { redirect_to my_drawings_url, notice: t(:drawing_success) }
          format.json { render :show, status: :created, location: @drawing }
        else
          format.html { render :new }
          format.json { render json: @drawing.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /drawings/1
    # PATCH/PUT /drawings/1.json
    def update
      respond_to do |format|
        if @drawing.update(drawing_params)
          format.html { redirect_to @drawing, notice: 'Drawing was successfully updated.' }
          format.json { render :show, status: :ok, location: @drawing }
        else
          format.html { render :edit }
          format.json { render json: @drawing.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /drawings/1
    # DELETE /drawings/1.json
    def destroy
      @drawing.destroy
      respond_to do |format|
        format.html { redirect_to drawings_url, notice: 'Drawing was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def search
      @page = params["page"]
      @start_date = search_params[:start_date]
      @end_date = search_params[:end_date]
      @state = search_params[:state]
      @drawings = Drawing.search(search_params).paginate(:page => @page)
      render :index
    end


    private
      # Use callbacks to share common setup or constraints between actions.
      def set_drawing
        @drawing = Drawing.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def drawing_params
        params.require(:drawing).permit(:amount, user_bank_attributes:[:id, :name, :card_number, :branch_name, :address, :current_money_password ])
      end

      def search_params
        params.permit(:start_date, :end_date, :state)
      end
  end
end

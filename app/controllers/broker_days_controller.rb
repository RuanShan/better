class SaleDaysController < ApplicationController
  before_action :set_sale_day, only: [:show, :edit, :update, :destroy]

  # GET /sale_days
  # GET /sale_days.json
  def index
    @sale_days = SaleDay.all
  end

  # GET /sale_days/1
  # GET /sale_days/1.json
  def show
  end

  # GET /sale_days/new
  def new
    @sale_day = SaleDay.new
  end

  # GET /sale_days/1/edit
  def edit
  end

  # POST /sale_days
  # POST /sale_days.json
  def create
    @sale_day = SaleDay.new(sale_day_params)

    respond_to do |format|
      if @sale_day.save
        format.html { redirect_to @sale_day, notice: 'Broker day was successfully created.' }
        format.json { render :show, status: :created, location: @sale_day }
      else
        format.html { render :new }
        format.json { render json: @sale_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sale_days/1
  # PATCH/PUT /sale_days/1.json
  def update
    respond_to do |format|
      if @sale_day.update(sale_day_params)
        format.html { redirect_to @sale_day, notice: 'Broker day was successfully updated.' }
        format.json { render :show, status: :ok, location: @sale_day }
      else
        format.html { render :edit }
        format.json { render json: @sale_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sale_days/1
  # DELETE /sale_days/1.json
  def destroy
    @sale_day.destroy
    respond_to do |format|
      format.html { redirect_to sale_days_url, notice: 'Broker day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sale_day
      @sale_day = SaleDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sale_day_params
      params.require(:sale_day).permit(:broker_id, :effective_on, :clink_visits, :blink_visits, :user_count, :valuable_member_count, :engergetic_member_count)
    end
end

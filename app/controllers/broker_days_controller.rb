class BrokerDaysController < ApplicationController
  before_action :set_broker_day, only: [:show, :edit, :update, :destroy]

  # GET /broker_days
  # GET /broker_days.json
  def index
    @broker_days = BrokerDay.all
  end

  # GET /broker_days/1
  # GET /broker_days/1.json
  def show
  end

  # GET /broker_days/new
  def new
    @broker_day = BrokerDay.new
  end

  # GET /broker_days/1/edit
  def edit
  end

  # POST /broker_days
  # POST /broker_days.json
  def create
    @broker_day = BrokerDay.new(broker_day_params)

    respond_to do |format|
      if @broker_day.save
        format.html { redirect_to @broker_day, notice: 'Broker day was successfully created.' }
        format.json { render :show, status: :created, location: @broker_day }
      else
        format.html { render :new }
        format.json { render json: @broker_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /broker_days/1
  # PATCH/PUT /broker_days/1.json
  def update
    respond_to do |format|
      if @broker_day.update(broker_day_params)
        format.html { redirect_to @broker_day, notice: 'Broker day was successfully updated.' }
        format.json { render :show, status: :ok, location: @broker_day }
      else
        format.html { render :edit }
        format.json { render json: @broker_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /broker_days/1
  # DELETE /broker_days/1.json
  def destroy
    @broker_day.destroy
    respond_to do |format|
      format.html { redirect_to broker_days_url, notice: 'Broker day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_broker_day
      @broker_day = BrokerDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def broker_day_params
      params.require(:broker_day).permit(:broker_id, :effective_on, :clink_visits, :blink_visits, :user_count, :valuable_member_count, :engergetic_member_count)
    end
end

class UserDaysController < ApplicationController
  before_action :set_user_day, only: [:show, :edit, :update, :destroy]

  # GET /user_days
  # GET /user_days.json
  def index
    @user_days = UserDay.all
  end

  # GET /user_days/1
  # GET /user_days/1.json
  def show
  end

  # GET /user_days/new
  def new
    @user_day = UserDay.new
  end

  # GET /user_days/1/edit
  def edit
  end

  # POST /user_days
  # POST /user_days.json
  def create
    @user_day = UserDay.new(user_day_params)

    respond_to do |format|
      if @user_day.save
        format.html { redirect_to @user_day, notice: 'User day was successfully created.' }
        format.json { render :show, status: :created, location: @user_day }
      else
        format.html { render :new }
        format.json { render json: @user_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_days/1
  # PATCH/PUT /user_days/1.json
  def update
    respond_to do |format|
      if @user_day.update(user_day_params)
        format.html { redirect_to @user_day, notice: 'User day was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_day }
      else
        format.html { render :edit }
        format.json { render json: @user_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_days/1
  # DELETE /user_days/1.json
  def destroy
    @user_day.destroy
    respond_to do |format|
      format.html { redirect_to user_days_url, notice: 'User day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_day
      @user_day = UserDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_day_params
      params.require(:user_day).permit(:user_id, :effective_on, :deposit_amount, :drawing_amount, :bid_amount, :bonus)
    end
end

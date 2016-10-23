class UserWalletsController < ApplicationController
  before_action :set_user_wallet, only: [:show, :edit, :update, :destroy]

  # GET /user_wallets
  # GET /user_wallets.json
  def index
    @user_wallets = UserWallet.all
  end

  # GET /user_wallets/1
  # GET /user_wallets/1.json
  def show
  end

  # GET /user_wallets/new
  def new
    @user_wallet = UserWallet.new
  end

  # GET /user_wallets/1/edit
  def edit
  end

  # POST /user_wallets
  # POST /user_wallets.json
  def create
    @user_wallet = UserWallet.new(user_wallet_params)

    respond_to do |format|
      if @user_wallet.save
        format.html { redirect_to @user_wallet, notice: 'User wallet was successfully created.' }
        format.json { render :show, status: :created, location: @user_wallet }
      else
        format.html { render :new }
        format.json { render json: @user_wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_wallets/1
  # PATCH/PUT /user_wallets/1.json
  def update
    respond_to do |format|
      if @user_wallet.update(user_wallet_params)
        format.html { redirect_to @user_wallet, notice: 'User wallet was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_wallet }
      else
        format.html { render :edit }
        format.json { render json: @user_wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_wallets/1
  # DELETE /user_wallets/1.json
  def destroy
    @user_wallet.destroy
    respond_to do |format|
      format.html { redirect_to user_wallets_url, notice: 'User wallet was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_wallet
      @user_wallet = UserWallet.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_wallet_params
      params.require(:user_wallet).permit(:user_id, :game_center_id, :amount, :memo, :deleted_at)
    end
end

class Admin::DepositsController < Admin::BaseController

  def new
    user = User.find_by_number(params["user_number"])
    @deposit = user.deposits.build
  end

  def create
    @deposit= Deposit.new(deposit_params)
    @deposit.payment_method = PaymentMethod.find_by_name("内部充值")
    if @deposit.save
      redirect_to record_admin_user_path(@deposit.user, record_for: 'deposit')
    else
      render :new
    end
  end

  private

  def deposit_params
    params.require(:deposit).permit(:amount, :memo, :user_id)
  end
end

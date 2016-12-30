class FuiouStatusController < ApplicationController
  #layout "gateway_redirect"
  skip_before_action :verify_authenticity_token

  def goto_gateway

  end

  # ReturnURL
  def done
    notify_params = permitted_notify_params
    if (Gateway::Fuiou::Sign.verify?( notify_params ))
      status = notify_params['order_pay_code']

      if status == "0000"

        complete_deposit( notify_params )

        redirect_to controller: "my/deposits", notice: "入金成功"
      else
        redirect_to controller: "my/deposits", notice: "入金失败，请联系客服！"
      end
    else
      redirect_to root_path, status: 404
    end
  end

  # AdviceURL
  def notify
    notify_params = permitted_notify_params
    if (Gateway::Ecpss::Sign.verify?( notify_params ))
      status = notify_params['Succeed']

      if status == "88"
        if bill_no.start_with( Deposit::NUMBER_PROFIX )
          complete_deposit
        end
      end
      render plain: "ok"
    end

  end

  def complete_deposit( notify_params )
    bill_no = notify_params['fy_ssn']
    order_id = notify_params['order_id']
    money = notify_params['order_amt'].to_f/100

    deposit = Deposit.find_by_number( order_id )
    unless deposit.success?
      deposit.process! if deposit.amount == money
    end
  end

  def permitted_notify_params
    params
  end
end

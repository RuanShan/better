class EcpssStatusController < ApplicationController
  layout "gateway_redirect"


  # ReturnURL
  def done
    notify_params = permitted_notify_params
    if (Gateway::Ecpss::Sign.verify?( notify_params ))
      status = notify_params['Succeed']

      if status == "88"
        if bill_no.start_with( Deposit::NUMBER_PROFIX )
          complete_deposit
        end
        redirect_to controller: "my/deposites", notice: "入金成功"
      else
        redirect_to controller: "my/deposites", notice: "入金失败，请联系客服！"
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

  def complete_deposit( bill_no )
    bill_no = notify_params['BillNo']);
    order_no = notify_params['OrderNo']
    money = notify_params['Amount']

    deposit = Deposit.find_by_number( bill_no )
    unless deposit.complete?
      deposit.process! if deposit.amount == money.to_f
    end
  end

  def permitted_notify_params
    params
  end
end

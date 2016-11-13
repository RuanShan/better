class EcpssStatusController < ApplicationController
  layout "gateway_redirect"
  VERIFY_PARAMS
  # ReturnURL
  def done

    #redirect to my/deposites
  end

  # AdviceURL
  def notify
  end

end

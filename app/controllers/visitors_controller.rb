# 推广链接点击统计
class VisitorsController < ApplicationController
  #layout 'visitor'

  def index
    @fullwith_content = true

    if params["number"]
      broker = Broker.find_by_number(params["number"])
      if broker.present?
        if current_broker or current_user
          session.clear
        end
        session["broker_number"] = params["number"]
      end
    end
  end

  def show
     render :json => current_user
  end
end

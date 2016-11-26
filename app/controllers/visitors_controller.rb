# 推广链接点击统计
class VisitorsController < ApplicationController
  #layout 'visitor'

  def index
    if params["number"]
      broker = Broker.find_by_number(params["number"])
      if broker.present?
        session["broker_number"] = params["number"]
      end
    end
  end
end

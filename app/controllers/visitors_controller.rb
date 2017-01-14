# 推广链接点击统计
class VisitorsController < ApplicationController
  #layout 'visitor'

  def index
    @fullwith_content = true
    @game_instruments = GameInstrument.hot.limit( 8)
    symbols = @game_instruments.pluck(:code)
    @game_instrument_trends = RedisService.get_trend_in_period(symbols, 600)

    if params["number"]
      broker = Broker.find_by_number(params["number"])
      if broker.present?
        if current_broker || current_user
          session.clear
        end
        set_broker_scope( broker )
      end
    end
  end

  def show
     render :json => current_user
  end
end

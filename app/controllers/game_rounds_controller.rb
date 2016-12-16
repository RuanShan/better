class GameRoundsController < ApplicationController
  def index
    @page = params["page"]
    @end_date = search_params[:end_date]
    #@state = search_params[:state]
    #@instrument_code = search_params[:instrument_code]
    @game_rounds = GameRound.search(search_params).paginate(:page => @page)
  end

  private

  def search_params
    #params.permit(:end_date, :end_time, :state, :instrument_code)
    params.permit(:end_date)
  end

end

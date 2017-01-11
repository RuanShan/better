class GameInstrumentsController < ApplicationController
  def trends
    codes = params["instrument_codes"] || ''

    @game_instruments = GameInstrument.where( code: codes.split(',') )
    codes = @game_instruments.map(&:code)
    @game_instrument_trends = RedisService.get_trend_in_period(codes, 600)

  end


end

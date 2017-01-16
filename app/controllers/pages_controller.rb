class PagesController < ApplicationController
  include HighVoltage::StaticPage
  layout :layout_for_page
  before_action :set_cros_header, :set_symbol_by_params, :set_page_width
  helper_method :current_seller

  def current_seller
    @current_seller ||= CurrentSeller.new( current_user )
  end

  private

  def layout_for_page
    case params[:id]
    when /^my/
      'user'
    else
      'application'
    end
  end

  def set_symbol_by_params
    page_id = params[:id]
    if page_id =~/forex/
      @list = params[:list] || session[:instrument_list] ||"popular"
      @category = params[:category] || session[:instrument_category] ||"currency"

      @game_instruments = case @list
      when "all"
        if page_id == 'forex_simple'
          GameInstrument.where(category_id: @category).all
        else
          GameInstrument.where(category_id: @category).all.paginate( page: params[:page], :per_page => 6 )
        end
      when "popular"
        if page_id == 'forex_simple'
          GameInstrument.where(category_id: @category).all
        elsif  page_id =~ /forex_adv/ #include my/forex_adv
          GameInstrument.all
        else
          GameInstrument.where(category_id: @category).all.hot.paginate( page: params[:page], :per_page => 6 )
        end
      when "collection"
        current_user ? current_user.game_instruments.where(category_id: @category) : []
      end

      symbols = @game_instruments.pluck(:code)

      @game_instrument_trends = RedisService.get_trend_in_period(symbols, 600)


      if symbols.include? params[:symbol]
        @symbol = params[:symbol]
      end
      @symbol ||= symbols.first

      @game_instrument = GameInstrument.where(code: @symbol).first
      session[:instrument_list] = @list
      session[:instrument_category] = @category
    end
  end

  def set_cros_header
    if params[:id] =~ /forex/
      response.headers['Access-Control-Allow-Origin'] = '*'
    end
  end

  def set_page_width
    if params[:id] =~ /forex_adv/
      @fullwith_content = true
    end
  end
end

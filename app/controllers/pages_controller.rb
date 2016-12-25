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
    @list = params[:list]
    @symbols = case params[:list]
    when "all"
      Forex.symbols
    when "popular"
      Forex.popular_symbols
    when "collection"
      current_user ? current_user.symbols_collection : []
    else
      @list = "popular"
      Forex.popular_symbols
    end
    if @symbols.include? params[:symbol]
      @symbol = params[:symbol]
    end
    @symbol ||= @symbols.first
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

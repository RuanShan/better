class PagesController < ApplicationController
  include HighVoltage::StaticPage
  layout :layout_for_page
  before_action :set_cros_header
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

  def set_cros_header
    if params[:id] =~ /forex/
      response.headers['Access-Control-Allow-Origin'] = '*'
    end
  end
end

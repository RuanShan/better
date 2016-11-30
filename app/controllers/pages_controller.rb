class PagesController < ApplicationController
  include HighVoltage::StaticPage
  layout :layout_for_page
  helper_method :current_seller

  def current_seller
    @current_seller ||= CurrentSeller.new( current_user )
  end

  private

  def layout_for_page
    Rails.logger.debug " layout_for_page #{params[:id]}"
    case params[:id]
    when /^my/
      'user'
    else
      'application'
    end
  end

end

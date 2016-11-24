class My::BaseController < ApplicationController
  layout 'user'
  before_action :authenticate_user!

  def current_seller
    @current_seller ||= CurrentSeller.new( current_user )
  end
end

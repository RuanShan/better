class My::BaseController < ApplicationController
  layout 'user'
  before_action :customer_authenticate_user!

  helper_method :current_seller

  def current_seller
    @current_seller ||= CurrentSeller.new( current_user )
  end

  def customer_authenticate_user!
    #if request.xhr?
    #  unless current_user
    #    # popup sign up dialog
    #    render "shared/unauthorized"
    #  end
    #else
      authenticate_user!
    #end
  end

end

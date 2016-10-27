class My::BaseController < ApplicationController
  layout 'user'
  before_action :authenticate_user!

end

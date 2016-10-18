class MessagesController < ApplicationController

  before_action :authenticate_user!
  before_action :admin_only, :only => []

  def index
    @page = params["page"]
  end

  def read
    if params["id"]
      @user_message_id=params["id"]
      user_message = UserMessage.find(params["id"])
      user_message.read
    else
      current_user.read_messages
      render "user_messages"
    end
  end

  def destroy
    UserMessage.find(params["id"]).destroy
    render "user_messages"
  end

end

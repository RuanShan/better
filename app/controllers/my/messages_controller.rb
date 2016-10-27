module My
  class MessagesController < BaseController

    def index
      @page = params["page"]
    end

    def read
      if params["id"]
        current_user.read_message params["id"]
      else
        current_user.read_messages
        render :js => "window.location = '/messages'"
      end
    end

    def destroy
      @page=params["page"]
      current_user.delete_message params["id"]
      render "user_messages"
    end

  end

end

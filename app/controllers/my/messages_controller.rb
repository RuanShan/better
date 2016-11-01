module My
  class MessagesController < BaseController

    def index
      @page = params["page"]
      @messages = current_user.available_messages.paginate(:page => @page)
    end

    def read
      if params["id"]
        current_user.read_message params["id"]
      else
        current_user.read_messages
        redirect_to controller: 'my/messages', :page=>@page
      end
    end

    def destroy
      @page=params["page"]
      current_user.delete_message params["id"]
      redirect_to controller: 'my/messages', :page=>@page
    end

    def delete
      current_user.delete_messages
      redirect_to controller: 'my/messages'
    end

  end

end

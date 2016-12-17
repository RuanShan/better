module Admin

  class MessagesController < BaseController

    def index
      @page = params['page']
      @messages = Message.order("created_at desc").all.paginate(:page => @page)
    end

    def new
      @message = Message.new
    end

    def create
      @message = Message.create(message_params)
      if @message.errors.empty?
        flash[:notice] = t(:message_created)
        redirect_to admin_messages_path
      else
        render :new
      end
    end

    def show
      @message = Message.find(params[:id])
    end

    def edit
      @message = Message.find(params[:id])
    end

    def update
      @message = Message.find(params[:id])
      if @message.update_attributes(secure_params)
        flash[:notice] = t(:message_updated)
        redirect_to admin_messages_path
      else
        render :edit
      end
    end

    def batch_delete
      message_ids = params["selected_messages"]
      if message_ids.blank?
        flash[:error] = t(:no_selected_messages)
      else
        Message.destroy(message_ids)
        flash[:notice] = t(:multi_message_deleted)
      end
      redirect_to admin_messages_path
    end

    def destroy
      message = Message.find(params[:id])
      message.destroy
      flash[:notice] = t(:message_deleted)
      redirect_to admin_messages_path
    end

    def search
      @page = params['page']
      @messages = Message.where("title=?", params['title']).order("created_at desc").all.paginate(:page => @page)
      render :index
    end

    def one_send
      message = Message.find(params[:id])
      message.send_self
      redirect_to admin_messages_path
    end

    def batch_send
      message_ids = params["selected_messages"]
      if message_ids.blank?
        flash[:error] = t(:no_selected_messages)
      else
        messages = Message.find(message_ids)
        messages.each{ |message| message.send_self }
        flash[:notice] = t(:multi_message_send)
      end
      redirect_to admin_messages_path
    end

    private

    def message_params
      params.require(:message).permit(:title, :content, :message_type)
    end

    def secure_params
      params.require(:message).permit(:title, :content, :message_type)
    end

  end
end

module Admin

  class DrawingsController < BaseController

    def index
      @page = params['page'] || 1
      @check = params['check']
      if @check == "1"
        @drawings = Drawing.pending.order("created_at desc").all.paginate(:page => @page)
        render :check
      else
        @drawings = Drawing.order("created_at desc").all.paginate(:page => @page)
      end
    end

    def show
      @drawing = Drawing.find_by_id(params[:id])
    end

    def search
      @page = params["page"]
      @email = params[:email]
      user = User.find_by_email(@email) if @email.present?
      user_id = user ? user.id : nil
      @start_date = search_params[:start_date]
      @end_date = search_params[:end_date]
      @state = search_params[:state]
      @drawings = Drawing.search(search_params, user_id).paginate(:page => @page)
      render :index
    end

    def batch_pass
      @page = params['page']
      drawing_ids = params["selected_drawings"]
      if drawing_ids.blank?
        flash[:error] = t(:no_selected_drawings)
      else
        drawings = Drawing.find(drawing_ids)
        drawings.each{|drawing|
          drawing.administrator = current_administrator
          drawing.pass!
        }
        flash[:notice] = t(:multi_drawings_passed)
      end
      redirect_to admin_drawings_path+"?check=1&page=#{@page}"
    end

    def pass
      @page = params['page']
      drawing = Drawing.find_by_id(params[:id])
      drawing.administrator = current_administrator
      drawing.pass!
      flash[:notice] = t(:drawing_passed)
      redirect_to admin_drawings_path+"?check=1&page=#{@page}"
    end

    def batch_deny
      @page = params['page']
      drawing_ids = params["selected_drawings"]
      if drawing_ids.blank?
        flash[:error] = t(:no_selected_drawings)
      else
        drawings = Drawing.find(drawing_ids)
        drawings.each{|drawing|
          drawing.administrator = current_administrator
          drawing.deny!
        }
        flash[:notice] = t(:multi_drawings_denied)
      end
      redirect_to admin_drawings_path+"?check=1&page=#{@page}"
    end

    def deny
      @page = params['page']
      drawing = Drawing.find_by_id(params[:id])
      drawing.administrator = current_administrator
      drawing.deny!
      flash[:notice] = t(:drawing_denied)
      redirect_to admin_drawings_path+"?check=1&page=#{@page}"
    end

    private

      def search_params
        params.permit(:start_date, :end_date, :state)
      end

  end
end

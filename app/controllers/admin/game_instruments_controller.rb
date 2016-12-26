module Admin

  class GameInstrumentsController < BaseController

    def index
      @page = params['page'] || 1
      @game_instruments = GameInstrument.order("created_at desc").all.paginate(:page => @page)
    end

    def show
      @game_instruments = GameInstrument.find_by_id(params[:id])
    end

    def search
      @page = params["page"]
      @category_id = params[:category_id]
      if @category_id.present?
        @game_instruments = GameInstrument.where("category_id=?",@category_id).order("created_at desc").paginate(:page => @page)
        render :index
      else
        redirect_to admin_game_instruments_path
      end
    end

    def batch_rate
      rate = params["rate"]
      GameInstrument.all.each{|gi|
        gi.rate = rate
        gi.save
      }
      redirect_to admin_game_instruments_path
    end
  end
end

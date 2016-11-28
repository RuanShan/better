class Admin::PromotionsController < Admin::BaseController

  def index
    @page = params['page'] || 1
    @promotions = Promotion.order("created_at desc").all.paginate(:page => @page)
  end

  def show
    @promotion = Promotion.find_by_number(params[:id])
  end

  def new
    @promotion = Promotion.new
  end

  def create
    @promotion = Promotion.create(promotion_params)
    if @promotion.errors.empty?
      flash[:notice] = t(:promotion_created)
      redirect_to admin_promotions_path
    else
      render :new
    end
  end

  def edit
    @promotion = Promotion.find_by_number(params[:id])
  end

  def update
    @promotion = Promotion.find_by_number(params[:id])
    if @promotion.update_attributes(promotion_params)
      flash[:notice] = t(:promotion_updated)
      redirect_to admin_promotions_path
    else
      render :edit
    end
  end

  def destroy
    promotion = Promotion.find_by_number(params[:id])
    promotion.destroy
    flash[:notice] = t(:promotion_deleted)
    redirect_to admin_promotions_path
  end

  def batch_delete
    promotion_ids = params["selected_promotions"]
    if promotion_ids.blank?
      flash[:error] = t(:no_selected_promotions)
    else
      Promotion.destroy(promotion_ids)
      flash[:notice] = t(:multi_promotions_deleted)
    end
    redirect_to admin_promotions_path
  end

  def search
    @page = params["page"]
    @rule = params[:rule]
    @promotions = Promotion.search(search_params).paginate(:page => @page)
    render :index
  end

  private

    def promotion_params
      params.require(:promotion).permit(:name, :description, :rule, :factor1, :factor2, :factor3)
    end

    def search_params
      params.permit(:rule)
    end

end

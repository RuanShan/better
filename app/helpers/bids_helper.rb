module BidsHelper

  def bid_platform_select(tag_name, selected_game="1")
    bp_select=select_tag tag_name, options_for_select(Game.all.collect {|g| [ g.name, g.id ] } , selected_game), class:"form-control"
    content_tag(:div, bp_select, style:'width:100px;float:left;margin:5px;')
  end
end

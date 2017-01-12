module BidsHelper

  def bid_platform_select(tag_name, selected_game="0")
    bp_select=select_tag tag_name, options_for_select([[ "所有资产", "0" ]] +GameInstrument.all.collect {|g| [ g.name, g.code ] } , selected_game), class:"form-control"
  end
end

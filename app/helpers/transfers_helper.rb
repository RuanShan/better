module TransfersHelper

  def transfer_state_select(tag_name, selected_state=1)
    ts_select=select_tag tag_name, options_for_select(Transfer.states.to_a , selected_state), class:"form-control"
    content_tag(:div, ts_select, style:'width:100px;float:left;margin:5px;')
  end
end

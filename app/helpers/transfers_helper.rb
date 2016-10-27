module TransfersHelper

  def transfer_state_select(tag_name, selected_state=:success)
    options = Transfer.state_machines[:machine_state].states.map {|s| [t("transfer_state.#{s.name}"), s.value]}

    ts_select=select_tag tag_name, options_for_select(options , selected_state), class:"form-control"
    content_tag(:div, ts_select, style:'width:100px;float:left;margin:5px;')
  end
end

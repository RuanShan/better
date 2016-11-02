module DrawingsHelper
  def drawing_state_select(tag_name, selected_state=:success)
    options=Drawing.state_machines[:state].states.map {|s| [display_state(s.name), s.value]}
    ds_select=select_tag tag_name, options_for_select(options, selected_state), class:"form-control"
  end
end

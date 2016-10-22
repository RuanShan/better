module DrawingsHelper
  def drawing_state_select(tag_name, selected_state=1)
    select_tag tag_name, options_for_select(Drawing.states.to_a , selected_state)
  end
end

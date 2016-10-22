module TransfersHelper

  def transfer_state_select(tag_name, selected_state=1)
    select_tag tag_name, options_for_select(Transfer.states.to_a , selected_state)
  end
end

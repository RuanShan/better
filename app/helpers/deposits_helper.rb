module DepositsHelper
  def deposit_state_select(tag_name, selected_state=1)
    select_tag tag_name, options_for_select(Deposit.states.to_a , selected_state)
  end
end

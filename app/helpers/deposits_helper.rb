module DepositsHelper
  def deposit_state_select(tag_name, selected_state=:success)
    options=Deposit.state_machines[:state].states.map{|s|[t(s.name), s.value]}
    ds_select=select_tag tag_name, options_for_select(options , selected_state), class:"form-control"
  end
end

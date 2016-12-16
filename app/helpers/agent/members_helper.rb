module Agent::MembersHelper
  def member_state_select(selected_state="all")
    options=[["全部","all"],["正常","normal"],["冻结","frozen"]]
    select_tag "member_state", options_for_select(options, selected_state), class:"form-control"
  end

end

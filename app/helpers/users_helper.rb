module UsersHelper
  def score_bar(score, bar_width)
    score_class = score.to_i>30 ? (score.to_i>50 ? (score.to_i==100 ? "progress-bar-success" : "") : "progress-bar-warning") : "progress-bar-danger"
    content_tag(:div, content_tag(:div, content_tag(:span, "#{score}%"), class: "progress-bar #{score_class}", role:"progressbar", 'aria-valuenow':"60", 'aria-valuemin':"0", 'aria-valuemax':"100", style:"width: #{score}%;"), class: "progress", style:"width:#{bar_width}px;")
  end

  def user_type_select(selected_type="all")
    options=[["全部","all"]]
    select_tag "user_type", options_for_select(options, selected_type), class:"form-control"
  end

  def user_state_select(selected_state="all")
    options=[["全部","all"]]
    select_tag "user_state", options_for_select(options, selected_state), class:"form-control"
  end

end

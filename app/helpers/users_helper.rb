module UsersHelper
  def score_bar(score, bar_width)
    content_tag(:div, content_tag(:div, content_tag(:center, "#{score}/100"), style: "background-color:#428bca;width:#{(bar_width*(score.to_f/100)).to_i}px;height:20px;"), style: "background-color:gray;width:#{bar_width}px;height:20px;")
  end
end

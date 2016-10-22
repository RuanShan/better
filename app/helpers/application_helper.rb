module ApplicationHelper

  def game_center_select(tag_name, selected_game_center="1")
    select_tag tag_name, options_for_select(GameCenter.all.collect {|cc| [ cc.name, cc.id ] }, selected_game_center )
  end

  def calendar(text_id)
    calendar_text = text_field_tag(text_id, '', class:'form-control', size:10) #"<input type='text' class='form-control' />"#
    calendar_span = content_tag(:span, content_tag(:span, "", class:'glyphicon glyphicon-calendar'), class:'input-group-addon')
    content_tag(:div, calendar_text+calendar_span, class:'calendar input-group date', style:'width:150px;float:left;')
  end
end

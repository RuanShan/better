module ApplicationHelper

  def game_center_select(tag_name, selected_game_center="1")
    gc_select = select_tag tag_name, options_for_select(GameCenter.all.collect {|cc| [ cc.name, cc.id ] }, selected_game_center ), class:"form-control"
    content_tag(:div, gc_select, style:'width:100px;float:left;margin:5px;')
  end

  def text_span(text)
    content_tag :span, text, style:'display:block;float:left;padding:5px;margin:5px;'
  end

  def calendar(text_id)
    calendar_text = text_field_tag(text_id, '', class:'form-control', size:10)
    calendar_span = content_tag(:span, content_tag(:span, "", class:'glyphicon glyphicon-calendar'), class:'input-group-addon')
    content_tag(:div, calendar_text+calendar_span, class:'calendar input-group date', style:'width:140px;float:left;margin:5px;')
  end
end

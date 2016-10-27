module ApplicationHelper

  def account_template(sub_title)
    #profile
    user_profile = render partial: "users/profile"
    #side_bar
    user_sidebar = render partial: "shared/user_sidebar"
    #panel
    panel_heading = content_tag(:div, sub_title, class:'panel-heading')
    penal_body = content_tag(:div, yield, class:'panel-body')
    user_panel = content_tag(:div, panel_heading+penal_body, class:'panel panel-default', style:'padding-top:20px;border: 0;')
    #content part
    user_content = content_tag(:div, user_panel, class:'col-md-9')
    row = content_tag(:div, user_sidebar+user_content)
    user_profile+row
  end

  def game_center_select(tag_name, selected_game_center="1")
    gc_select = select_tag tag_name, options_for_select(GameCenter.all.collect {|cc| [ cc.name, cc.id ] }, selected_game_center ), class:"form-control"
    content_tag(:div, gc_select, style:'width:100px;float:left;margin:5px;')
  end

  def text_span(text)
    content_tag :span, text, style:'display:block;float:left;padding:5px;margin:5px;'
  end

  def inline_text_span(text)
    content_tag :span, text, style:'margin:5px;'
  end

  def calendar(text_id, value)
    calendar_text = text_field_tag(text_id, value, class:'form-control', size:10)
    calendar_span = content_tag(:span, content_tag(:span, "", class:'glyphicon glyphicon-calendar'), class:'input-group-addon')
    content_tag(:div, calendar_text+calendar_span, class:'calendar input-group date', style:'width:140px;float:left;margin:5px;')
  end
end

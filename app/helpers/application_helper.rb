module ApplicationHelper

  def better_form_for(object, *args, &block)
    options = args.extract_options!
    simple_form_for(object, *(args << options.merge(builder: BetterFormBuilder, defaults: { wrapper_html: { style: 'display:block;margin:10px 0;' }, input_html: {:style => 'margin:0px 10px;'} }, :html => {:class => 'form-inline' })), &block)
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

class BetterFormBuilder < SimpleForm::FormBuilder
  def fields_for(attribute_name, options = {}, &block)
    super(attribute_name, options.merge(defaults: { wrapper_html: { style: 'display:block;margin:10px 0;' }, input_html: {:style => 'margin:0px 10px;'} }, :html => {:class => 'form-inline' }), &block)
  end
end

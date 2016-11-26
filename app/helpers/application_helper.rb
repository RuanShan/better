module ApplicationHelper

  def self.member_link(broker)
    "http://w.aslbj.com/#{broker.number}"
  end

  def self.broker_link(broker)
    "http://w.aslbj.com/#{broker.number}"
  end

  def better_form_for(object, *args, &block)
    options = args.extract_options!
    simple_form_for(object, *(args << options.merge(wrapper: "horizontal_form", builder: BetterFormBuilder, :html => {:class => 'form-horizontal' })), &block)
  end

  def text_span(text)
    content_tag :span, text, style:'display:block;float:left;padding:5px;margin:5px;'
  end

  def inline_text_span(text)
    content_tag :span, text, style:'margin:5px;'
  end

  def calendar(text_id, value, calendar_class="calendar")
    calendar_text = text_field_tag(text_id, value, class:'form-control', size:10)
    calendar_span = content_tag(:span, content_tag(:span, "", class:'fa fa-calendar'), class:'input-group-addon')
    content_tag(:div, calendar_text+calendar_span, class:"#{calendar_class} input-group date")
  end

  def display_money(amount)
    BetterMoney.new(amount).to_s
  end

  def display_state(state)
    {:success=>"成功", :failure=>"失败", :pending=>"待处理"}[state.to_sym]
  end

end

class BetterFormBuilder < SimpleForm::FormBuilder
  def fields_for(attribute_name, options = {}, &block)
    super(attribute_name, options.merge(wrapper: "horizontal_form", :html => {:class => 'form-inline' }), &block)
  end
end

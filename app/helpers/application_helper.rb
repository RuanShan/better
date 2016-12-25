module ApplicationHelper

  def self.member_link(broker)
    "http://www.ballmerasia.com/#{broker.number}"
  end

  def self.broker_link(broker)
    "http://www.ballmerasia.com/agent/#{broker.number}"
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
    icon = calendar_class=="time_calendar" ? "clock-o" : "calendar"
    calendar_text = text_field_tag(text_id, value, class:'form-control', size:10)
    calendar_span = content_tag(:span, content_tag(:span, "", class:"fa fa-#{icon}"), class:'input-group-addon')
    content_tag(:div, calendar_text+calendar_span, class:"#{calendar_class} input-group date")
  end

  def display_money(amount)
    BetterMoney.new(amount).to_s
  end

  def instrument_code_select(tag_name, selected_code="")
    iq_select=select_tag tag_name, options_for_select(["all",""]+Instrument.all.collect {|i| [ i.code, i.code ] } , selected_code), class:"form-control"
  end

  def game_round_state_select(tag_name, selected_state=:success)
    options=GameRound.state_machines[:state].states.map {|s| [t(s.name), s.value]}
    ds_select=select_tag tag_name, options_for_select(options, selected_state), class:"form-control"
  end

end

class BetterFormBuilder < SimpleForm::FormBuilder
  def fields_for(attribute_name, options = {}, &block)
    super(attribute_name, options.merge(wrapper: "horizontal_form", :html => {:class => 'form-inline' }), &block)
  end
end

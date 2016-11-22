module Agent::BaseHelper

  # url_params { controller: 'my/deposits'}
  def build_nav_link( text, url_params={} )

    link_to url_for(url_params ), class: ( current_page?(url_params) ? "my-navs-item my-navs-item-active" : "my-navs-item" )do
       text
    end
  end

  def member_link(broker)
    "#{request.protocol}#{request.host_with_port}#{root_path}#{broker.number}"
  end

  def broker_link(broker)
    "#{request.protocol}#{request.host_with_port}#{agent_root_path}/#{broker.number}"
  end

  def member_level_select(selected_level="1")
    options=[["第一级","1"],["第二级","2"],["第三级","3"],["第四级","4"],["第五级","5"],["第六级","6"]]
    select_tag "member_level", options_for_select(options, selected_level), class:"form-control"
  end
  
end

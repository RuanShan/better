module Agent::BaseHelper

  # url_params { controller: 'my/deposits'}
  def build_nav_link( text, url_params={} )

    link_to url_for(url_params ), class: ( current_page?(url_params) ? "my-navs-item my-navs-item-active" : "my-navs-item" )do
       text
    end
  end
end

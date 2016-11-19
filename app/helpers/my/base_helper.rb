module My::BaseHelper

  # url_params { controller: 'my/deposits'}
  def build_user_nav_link( text, url_params={} )

    link_to url_for(url_params ), class: ( current_page?(url_params) ? "my-navs-item my-navs-item-active" : "my-navs-item" )do
       text
    end
  end

  def invite_link(user)
    sign_up_path = "/users/sign_up"
    "http://localhost:3000"+sign_up_path+"?inviter_id=#{user.id}"
  end
end

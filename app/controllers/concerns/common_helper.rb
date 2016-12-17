module CommonHelper
  extend ActiveSupport::Concern

  included do
    self.prepend_before_action :set_view_variant
    self.helper_method :mobile?
  end

  MOBILE_USER_AGENTS = 'palm|blackberry|nokia|phone|midp|mobi|symbian|chtml|ericsson|minimo|' \
                     'audiovox|motorola|samsung|telit|upg1|windows ce|ucweb|astel|plucker|' \
                     'x320|x240|j2me|sgh|portable|sprint|docomo|kddi|softbank|android|mmp|' \
                     'pdxgw|netfront|xiino|vodafone|portalmmm|sagem|mot-|sie-|ipod|up\\.b|' \
                     'webos|amoi|novarra|cdm|alcatel|pocket|iphone|mobileexplorer|mobile'
  def mobile?
    agent_str = request.user_agent.to_s.downcase
    #return true if turbolinks_app?
    return false if agent_str =~ /ipad/
    agent_str =~ Regexp.new(MOBILE_USER_AGENTS)
  end


  def set_view_variant
    request.variant = :mobile if mobile?
    request.variant = :mobile if cookies[:BETTER_DEVELOPMENT_MOBILE] == '1'
  end
end

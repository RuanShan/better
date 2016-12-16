require 'net/http'
require 'cgi'

module Gateway::Ecpss

  @debug_mode = true
  @sign_type = 'MD5'
  @return_url = "/ecpss_status/done"
  @advice_url = "/ecpss_status/notify"

  class << self
    attr_accessor :mer_no, :key, :sign_type, :debug_mode
    attr_accessor :return_url, :advice_url
    def debug_mode?
      !!@debug_mode
    end
  end
end

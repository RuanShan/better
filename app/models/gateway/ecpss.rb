require 'net/http'
require 'cgi'

module Gateway::Ecpss

  @debug_mode = true
  @sign_type = 'MD5'

  class << self
    attr_accessor :pid, :key, :sign_type, :debug_mode

    def debug_mode?
      !!@debug_mode
    end
  end
end

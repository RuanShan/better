require 'digest/md5'
module Gateway::Ecpss
  module Sign
    def self.generate(params, options = {})
      params = Utils.stringify_keys(params)
      sign_type = options[:sign_type] || Ecpss.sign_type
      key = options[:key] || Ecpss.key
      string = params_to_string(params)
      sign(key, string).upcase

    end

    def self.params_to_string(params)
      params.sort.map { |item| item.join('=') }.join('&')
    end

    def self.sign(key, string)
      Digest::MD5.hexdigest("#{string}&#{key}")
    end

  end
end

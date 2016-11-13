require 'digest/md5'
module Gateway::Ecpss
  module Sign
    def self.generate(params, options = {})
      params = Utils.stringify_keys(params)
      sign_type = options[:sign_type] || Gateway::Ecpss.sign_type
      key = options[:key] || Gateway::Ecpss.key
      string = params_to_string(params)
      sign(key, string).upcase

    end

    # request prams order by [MerNo,BillNo,Amount,OrderTime,ReturnURL,AdviceURL]
    # notify prams order by [MerNo,BillNo,OrderNo,Amount,Succeed]
    def self.params_to_string(params)
      params.sort.map { |item| item.join('=') }.join('&')
    end

    def self.sign(key, string)
      Digest::MD5.hexdigest("#{string}&#{key}")
    end

    def self.verify?(params, options = {})
      params = Utils.stringify_keys(params)

      sign_type = options[:sign_type] || Gateway::Ecpss.sign_type
      sign = params.delete('SignInfo')
      string = params_to_string(params)

      case sign_type
      when 'MD5'
        key = options[:key] || Gateway::Ecpss.key
        MD5.verify?(key, string, sign)
      else
        false
      end
    end

  end
end

module Gateway::Ecpss
  module Service
    GATEWAY_URL = 'https://gwapi.yemadai.com/pay/sslpayment'

    CREATE_YEMADAI_REQUIRED_PARAMS = %w(BillNo Amount ReturnURL AdviceURL OrderTime)

    def self.create_yemadai_url(params, options = {})
      # optional params: products, remark, defaultBankNumber
      mer_no =  options[:mer_no] || Gateway::Ecpss.mer_no

      params = Utils.stringify_keys(params)
      check_required_params(params, CREATE_YEMADAI_REQUIRED_PARAMS)

      params = {
        'MerNo' => mer_no,   #商户号
        'defaultBankNumber' => options[:default_bank_number] || 'OTHERS', #银联其它银行
                  #'orderTime' => DateTime.current.to_s(:number)  # => "20071204000000"
      }.merge(params)
      request_uri(params, options).to_s
    end


    def self.request_uri(params, options = {})
      uri = URI(GATEWAY_URL)
      uri.query = URI.encode_www_form(sign_params(params, options))
      uri
    end

    def self.sign_params(params, options = {})
      #$md5src = "MerNo=".$MerNo. "&BillNo=".$BillNo."&Amount=".$Amount."&OrderTime=".$OrderTime. "&ReturnURL=".$ReturnURL ."&AdviceURL=".$AdviceURL."&".$MD5key ;		//校验源字符串

      params.merge(
        'SignInfo' => Gateway::Ecpss::Sign.generate(params, options)
      )
    end

    def self.check_required_params(params, names)
      return if !Gateway::Ecpss.debug_mode?

      names.each do |name|
        warn("Gateway::Ecpss Warn: missing required option: #{name}") unless params.has_key?(name)
      end
    end

    def self.check_optional_params(params, names)
      return if !Gateway::Ecpss.debug_mode?

      warn("Gateway::Ecpss Warn: must specify either #{names.join(' or ')}") if names.all? {|name| params[name].nil? }
    end
  end
end

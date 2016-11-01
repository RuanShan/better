module Gateway::Ecpss
  module Service
    GATEWAY_URL = 'https://gwapi.yemadai.com/pay/sslpayment'

    CREATE_YEMADAI_REQUIRED_PARAMS = %w(bill_no amount return_url advice_url order_time)

    def self.create_partner_trade_by_buyer_url(params, options = {})
      # optional params: products, remark, defaultBankNumber

       params = Utils.stringify_keys(params)
       check_required_params(params, CREATE_YEMADAI_REQUIRED_PARAMS)

       $md5src = $this->merNo . '&' . $payment->id . '&' . $params['Amount'] . '&' . $params['ReturnURL'] . '&' . $this->md5Key;        //校验源字符串
       $params['SignInfo'] = strtoupper(md5($md5src));        //MD5检验结果

       params = {
                  'MerNo' => options[:mer_no] || Ecpss.mer_no,   #商户号
                  'defaultBankNumber' => options[:default_bank_number] || 'UNIONPAY', #默认走银联
                  #'orderTime' => Datetime.current.to_s(:number)  # => "20071204000000"
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
        'SignInfo' => Ecpss::Sign.generate(params, options)
      )
    end

    def self.check_required_params(params, names)
      return if !Ecpss.debug_mode?

      names.each do |name|
        warn("Alipay Warn: missing required option: #{name}") unless params.has_key?(name)
      end
    end

    def self.check_optional_params(params, names)
      return if !Alipay.debug_mode?

      warn("Alipay Warn: must specify either #{names.join(' or ')}") if names.all? {|name| params[name].nil? }
    end
  end
end

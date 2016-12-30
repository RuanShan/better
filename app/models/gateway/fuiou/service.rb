module Gateway::Fuiou
  module Service
    GATEWAY_URL = 'https://pay.fuiou.com/smpGate.do'
    GATEWAY_TEST_URL = 'http://www-1.fuiou.com:8888/wg1_run/smpGate.do'
                      #http://www-1.fuiou.com:8888/wg1_run/smpGate.do
    CREATE_YEMADAI_REQUIRED_PARAMS = %w(order_id order_amt iss_ins_cd)

    def self.create_pc_url(params, options = {})
      # optional params: products, remark, defaultBankNumber

      params = Utils.stringify_keys(params)
      check_required_params(params, CREATE_YEMADAI_REQUIRED_PARAMS)

      params = {
        'mchnt_cd' => Gateway::Fuiou.mchnt_cd,   #商户号
        'order_pay_type' => options[:order_pay_type] || 'B2C', #银联其它银行
        'page_notify_url' => Gateway::Fuiou.page_notify_url,
        'back_notify_url' => Gateway::Fuiou.back_notify_url,
        'ver' => '1.0.1',
        'order_valid_time' => '15m',
        'goods_name'=>'',
        'goods_display_url'=>'',
        'rem'=>''
        #'iss_ins_cd'
      }.merge(params)
      request_uri(params, options).to_s
    end

    def self.create_sign_string(params, options = {})
      # optional params: products, remark, defaultBankNumber

      params = Utils.stringify_keys(params)

      params = {
        'mchnt_cd' => Gateway::Fuiou.mchnt_cd,   #商户号
        'order_pay_type' => options[:order_pay_type] || 'B2C', #银联其它银行
        'page_notify_url' => Gateway::Fuiou.page_notify_url,
        'back_notify_url' => Gateway::Fuiou.back_notify_url,
        'ver' => '1.0.1',
        'order_valid_time' => '15m',
        'goods_name'=>'',
        'goods_display_url'=>'',
        'rem'=>''
        #'iss_ins_cd'
      }.merge(params)
      Gateway::Fuiou::Sign.generate(params, options)
    end

    def self.request_uri(params, options = {})
      url = Rails.env.production? ? GATEWAY_URL : GATEWAY_TEST_URL
      uri = URI(url)
      uri.query = URI.encode_www_form(sign_params(params, options))
      uri
    end

    def self.sign_params(params, options = {})
      #$md5src = "MerNo=".$MerNo. "&BillNo=".$BillNo."&Amount=".$Amount."&OrderTime=".$OrderTime. "&ReturnURL=".$ReturnURL ."&AdviceURL=".$AdviceURL."&".$MD5key ;		//校验源字符串

      params.merge(
        'md5' => Gateway::Fuiou::Sign.generate(params, options)
      )
    end

    def self.check_required_params(params, names)
      return if !Gateway::Fuiou.debug_mode?

      names.each do |name|
        warn("Gateway::Fuiou Warn: missing required option: #{name}") unless params.has_key?(name)
      end
    end

    def self.check_optional_params(params, names)
      return if !Gateway::Fuiou.debug_mode?

      warn("Gateway::Fuiou Warn: must specify either #{names.join(' or ')}") if names.all? {|name| params[name].nil? }
    end
  end
end

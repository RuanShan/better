require 'digest/md5'
module Gateway::Fuiou
  module Sign
    def self.generate(params, options = {})
      params = Utils.stringify_keys(params)
      key = options[:mchnt_key] || Gateway::Fuiou.mchnt_key
      string = params_to_string(params)
      sign(key, string)

    end


    # request prams order by [MerNo,BillNo,Amount,OrderTime,ReturnURL,AdviceURL]
    # notify prams order by [MerNo,BillNo,OrderNo,Amount,Succeed]
    # mchnt_cd+"|" + order_id+"|"+ order_amt+"|"+ order_pay_type+"|"+
    # page_notify_url+"|"+ back_notify_url+"|"+ order_valid_time+"|"+ iss_ins_cd+"|"+
    # goods_name+"|"+"+ goods_display_url+"|"+ rem+"|"+ ver+"|"+ mchnt_key
    def self.params_to_string(params)
      [ params['mchnt_cd'], params['order_id'], params['order_amt'], params['order_pay_type'],  \
        params['page_notify_url'], params['back_notify_url'], params['order_valid_time'],       \
        params['iss_ins_cd'], params['goods_name'], params['goods_display_url'], params['rem'], \
        params['ver'] ].join('|')

    end

    def self.response_params_to_string( params )
      [ params['mchnt_cd'], params['order_id'], params['order_date'], params['order_amt'], \
        params['order_st'], params['order_pay_code'], params['order_pay_error'],\
        params['resv1'], params['fy_ssn']].join('|')
    end

    def self.sign(key, string)
      Digest::MD5.hexdigest("#{string}|#{key}")
    end

    def self.verify?(params, options = {})
      params = Utils.stringify_keys(params)

      sign_type = options[:sign_type] || Gateway::Fuiou.sign_type
      md5  = params.delete('md5')
      key =  Gateway::Fuiou.mchnt_key
      string = response_params_to_string(params)
      new_sign = sign(key, string)

Rails.logger.debug "string=#{string}, new_sign=#{new_sign}, sign=#{md5}"

      case sign_type
      when 'MD5'
        sign(key, string) == md5
      else
        false
      end
    end

  end
end

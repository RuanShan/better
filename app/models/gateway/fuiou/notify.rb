module Gateway::Fuiou
  module Notify
    def self.verify?(params, options = {})
      params = Utils.stringify_keys(params)
      mer_no = options[:mer_no] || Gateway::Fuiou.mer_no
      Sign.verify?(params, options)
    end

    def self.verify_notify_id?(pid, notify_id)
      uri = URI("https://mapi.alipay.com/gateway.do")
      uri.query = URI.encode_www_form(
        'service'   => 'notify_verify',
        'partner'   => pid,
        'notify_id' => notify_id
      )
      Net::HTTP.get(uri) == 'true'
    end
  end
end

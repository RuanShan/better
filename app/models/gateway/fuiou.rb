require 'net/http'
require 'cgi'

module Gateway
  module Fuiou
    @ver = '1.0.1'
    @debug_mode = true
    @sign_type = 'MD5'
    @page_notify_url = "http://127.0.0.1:3000/fuiou_status/done"
    @back_notify_url = "http://127.0.0.1:3000/fuiou_status/notify"
    @iss_ins_cd_enum = { '中国工商银行': '0801020000',
      '中国农业银行' =>	'0801030000',
      '中国建设银行' => '0801050000',
      '中国民生银行' => '0803050000',
      '中国邮政'=> '0801000000',
      '上海农村商业银行' => '0865012900',
      '中国光大银行' =>'0803030000',
      '华夏银行' =>'0803040000',
      '招商银行' =>'0803080000',
      '洛阳银行' =>'0804184930',
      '中国银行' =>'0801040000',
      '交通银行' =>'0803010000',
      '浦发银行' =>'0803100000',
      '兴业银行' =>'0803090000',
      '中信银行' =>'0803020000',
      '北京银行' =>'0804031000',
      '广发银行' =>'0803060000',
      '平安银行' =>'0804105840',
      '大连鑫汇村镇银行' =>'0803202220',
      '银联'=>'0000000000'}

    class << self
      attr_accessor :mchnt_cd, :mchnt_key, :sign_type, :debug_mode, :ver
      attr_accessor :page_notify_url, :back_notify_url
      def debug_mode?
        !!@debug_mode
      end

      #order_id, order_amt, order_pay_type ='B2C', ver
    end
  end
end

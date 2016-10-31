require "open-uri"
require "json"
module Juhe
  module IdCard
    class << self
      attr_accessor :app_key
    end

    def self.search(id_number, real_name, options = nil)
      app_key = (options[:app_key] if options) || Juhe::IdCard.app_key
      url = "http://op.juhe.cn/idcard" \
            + "/query?key=" + app_key \
            + "&idcard=" + id_number \
            + "&realname=" + real_name
      query_url = URI::escape(url)
      result = JSON.parse(open(query_url).read)
      #result = {"reason"=>"成功1", "result"=>{"realname"=>"ABC", "idcard"=>"1234567890", "res"=>1}, "error_code"=>0}
      #result = {"reason"=>"not allowned", "result"=>{"realname"=>"ABC", "idcard"=>"1234567890", "res"=>1}, "error_code"=>12098}
      info = result["error_code"].to_i == 0 ? result["result"] : result["reason"]
      [result["error_code"], info]
    end

  end

  module Bank
    class << self
      attr_accessor :verify_app_key, :info_app_key
    end

    def self.verify_bank(bank_number, id_card, real_name, options = nil)
      app_key = (options[:app_key] if options) || Juhe::Bank.verify_app_key
      url = "http://v.juhe.cn/verifybankcard3" \
            + "/query?key=" + app_key \
            + "&idcard=" + id_card \
            + "&bankcard=" + bank_number \
            + "&realname=" + real_name
      query_url = URI::escape(url)
      #Rails.logger.debug "+++++++++++++++++++++++query_url=#{query_url.inspect}"
      result = JSON.parse(open(query_url).read)
      #result = {"reason"=>"查询成功", "result"=>{"bankcard"=>"123456", "realname"=>"ABC", "idcard"=>"123456787654", "res"=>1}, "error_code"=>0}
      #Rails.logger.debug "+++++++++++++++++++++++result=#{result.inspect}"
      info = result["error_code"].to_i == 0 ? result["result"] : result["reason"]
      [result["error_code"], info]
    end

    def self.get_bank_info(bank_number, options = nil)
      app_key = (options[:app_key] if options) || Juhe::Bank.info_app_key
      url = "http://v.juhe.cn/verifybankcard" \
            + "/query?key=" + app_key \
            + "&num=" + bank_number
      result = JSON.parse(open(url).read)
      result["error_code"] == "0" ? result["result"] : result["reason"]
    end

  end
end

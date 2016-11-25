class Sms
  include ActiveModel::Model

  attr_accessor :phone, :code, :send_at
  validates :phone, length: { in: 7..11 }, format: { with: /\A\d+\z/, message: "must be number" }

  validate :send_at_validation, if: :send_at

  def initialize(attributes={})
    self.code = rand(999999).to_s
    super
  end

  def send_for_sign_up
    alidayu_respond = Alidayu.send_sms({
      template_id: "SMS_22595044",
      sign_name: "软山网络",#软山网络,大连软山
      params: {
        code: code,
        product: '',
      },
      phones: phone
    })

    if validate_alidayu_response(alidayu_respond)
      send_at = DateTime.current
    end

    self.errors.empty?
  end

  def verify_sign_up_sms( some_phone, some_code )
    #logger.debug "++++++++++validate_code=#{validate_code},code_options['validate_code']=#{code_options['validate_code']}"
    unless code == some_code.to_s
      errors.add(:code, "验证码不正确")
    end
    send_at_validation
    errors.empty?
  end

  def send_at_validation

      last_send_duration = Time.now - self.send_at.to_time # 
      if last_send_duration > 10*60
        errors.add(:send_at, "验证码过期，请重新发送")
      end

  end
  #error_respond={"error_response"=>{"code"=>15, "msg"=>"Remote service error", "sub_code"=>"isv.BUSINESS_LIMIT_CONTROL", "sub_msg"=>"触发业务流控", "request_id"=>"3b4kmfzkvbq7"}}
  #success_respond={"alibaba_aliqin_fc_sms_num_send_response"=>{"result"=>{"err_code"=>"0", "model"=>"104132741839^1105207555898", "success"=>true}, "request_id"=>"z24nkhmlp79h"}}
  def validate_alidayu_response(alidayu_response)
    success = false
    if alidayu_response["error_response"]
      error_code = alidayu_response["error_response"]["code"]
      case error_code
      when 15
      when 40
        #errors.add(:phone, "请输入手机号")
      else
        error_message = alidayu_response["error_response"]["msg"]+":"+alidayu_response["error_response"]["sub_msg"]
        Rails.logger.debug "error_code=#{error_code}, error_message = #{error_message}"
        #errors.add(:validate_code, error_message)
      end
    else
      rresponse = alidayu_response["alibaba_aliqin_fc_sms_num_send_response"]["result"]
      success = rresponse["success"] == true

    end
    success
  end

end

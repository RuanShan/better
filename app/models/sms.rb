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
    content = "您好，当前验证码为#{code}，请勿泄露给他人。【酷伯二元期权】"
    url = "http://api.bjszrk.com/sdk/BatchSend.aspx" \
          + "?CorpID=" + ENV["BETTER_CORPID"] \
          + "&pwd=" + ENV["BETTER_PWD"] \
          + "&Mobile=" + phone \
          + "&Content="+content
    query_url = URI::escape(url)
    result = open(query_url).read.to_i
    get_sms_response_error(result) if result < 0
    errors.empty? ? true : false
  end

  def verify_sign_up_sms( some_phone, some_code )
    unless phone == some_phone.to_s
      errors.add(:phone, "必须使用发送验证码的电话号码")
    end
    unless code == some_code.to_s
      errors.add(:validate_code, "验证码不正确")
    end
    send_at_validation
    errors.empty?
  end

  def send_at_validation
    if self.send_at
      last_send_duration = Time.now - self.send_at.to_time #
      if last_send_duration > 10*60
        errors.add(:send_at, "验证码过期，请重新发送")
      end
    end
  end

  def get_sms_response_error(code)
=begin
    –1 账号未注册
    –2 其他错误
    –3 帐号或密码错误
    –4 一次提交信息不能超过10000个手机号码，号码逗号隔开
    –5 余额不足，请先充值
    –6 定时发送时间不是有效的时间格式
    –8 发送内容需在3到250字之间
    -9 发送号码为空
    -104 短信内容包含关键字
=end
    if code == -9
      errors.add(:phone, "请输入正确的手机号")
    else
      errors.add(:validate_code, "发送失败")
    end
  end

end

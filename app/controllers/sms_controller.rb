class SmsController < ApplicationController
  before_action :build_sms, only: [:create_verify_code]
  before_action :set_sms, only: [:show, :edit, :update, :destroy]

  def create_verify_code

    session[:sign_up_sms] = @sms.tap{|sms| sms.send_at = DateTime.current}
    render :stub_create_verify_code
    return

    # validate phone number
    unless @sms.valid?

    end
    sms = Sms.new( phone: @phone, code: @code)

    sms.send_for_sign_up
    # send successfully
    if sms.send_for_sign_up

    else

    end



  end

  private
    def build_sms
      @sms = Sms.new( phone: params[:phone] )
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_sms
      unless current_user
        session[:sign_up_sms]
      end


    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sms_params
      params.require(:phone)
    end
end

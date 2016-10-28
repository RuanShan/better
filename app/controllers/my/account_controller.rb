module My
  class AccountController < BaseController

    def index
      @user = current_user
      @deposits = @user.deposits.order("created_at desc").limit(10)
    end

    def deposit
      @user = current_user
    end

    def show
      @user = current_user
      @deposits = @user.deposits.order("created_at desc").limit(10)
    end

    def update
      @user = User.find(params[:id])
      if @user.update_attributes(secure_params)
        redirect_to users_path, :notice => "User updated."
      else
        redirect_to users_path, :alert => "Unable to update user."
      end
    end

    def destroy
      user = User.find(params[:id])
      user.destroy
      redirect_to users_path, :notice => "User deleted."
    end

    def change_password
      if request.patch?
        current_user.change_password(params["user"])
        if current_user.errors.empty?
          flash[:notice] = "Password changed!"
        end
        render :change_password
      end
    end

    def change_profile
      if request.patch?
        current_user.update_attributes(profile_params)
        if current_user.errors.empty?
          flash[:notice] = "Profile updated!"
        end
        render :change_profile
        #redirect_to change_profile_user_path(current_user)
      end
    end

    def set_email
      if request.patch?
        current_user.set_email(email_params)
        if current_user.errors.empty?
          flash[:notice] = "we've send an email to you, please confirm it!"
          redirect_to security_center_user_path(current_user)
        else
          flash[:error] = current_user.errors.full_messages[0]
          redirect_to set_email_user_path(current_user)
        end
      end
    end

    def set_password_protection
      if request.patch?
        current_user.set_password_protection(pp_params)
        if current_user.errors.empty?
          flash[:notice] = "password protection success!"
          redirect_to security_center_user_path(current_user)
        else
          flash[:error] = current_user.errors.full_messages[0]
          redirect_to set_password_protection_user_path(current_user)
        end
      end
    end

    def bind_name
      if request.patch?
        validate_code = params["validate_code"]
        if validate_my_code(validate_code)
          if session["validate_phone"] == bind_name_params["phone"]
            current_user.bind_name(bind_name_params)
            if current_user.errors.empty?
              flash[:notice] = "bind name success!"
              redirect_to security_center_user_path(current_user)
            else
              render :bind_name

              #flash[:error] = current_user.errors.full_messages[0]
              #redirect_to bind_name_user_path(current_user)
            end
          else
            flash[:notice] = "phone number must be the one send validate code!"
            render :bind_name
            #redirect_to bind_name_user_path(current_user)
          end
        else
          render :bind_name
          #redirect_to bind_name_user_path(current_user)
        end
      end
    end

    def send_validate_code
      phone = params["phone"]
      code="123456"
      error_message=""
=begin
      code =rand(999999).to_s
      alidayu_respond = Alidayu.send_sms({
        template_id: "SMS_22595044",
        sign_name: "软山网络",#软山网络,大连软山
        params: {
          code: code,
          product: '',
        },
        phones: phone
      })
      #logger.debug "----------------code=#{code},alidayu_respond=#{alidayu_respond.inspect}"
      error_message = validate_alidayu_response(alidayu_respond)
      #logger.debug "----------------error_message=#{error_message.inspect}"
=end
      if error_message == ""
        session["validate_phone"] = phone
        session["validate_code"] = code
        session["validate_code_send_time"] = Time.now
      else
        flash[:error] = error_message
        redirect_to bind_name_user_path(current_user)
      end
    end

    def bind_bank
      if request.post?
        current_money_password = params["current_money_password"]
        new_bank = current_user.bind_bank(current_money_password, bank_params)
        if new_bank.errors.empty?
          flash[:notice] = "bind bank success!"
          redirect_to security_center_user_path(current_user)
        else
          flash[:error] = new_bank.errors.full_messages[0]
          redirect_to bind_bank_user_path(current_user)
        end
      else
        @user_bank = current_user.bind_bank? ? current_user.user_banks.first : current_user.user_banks.new
      end
    end

    private


    def secure_params
      params.require(:user).permit(:role)
    end

    def email_params
      params.require(:user).permit(:current_password, :email)
    end

    def profile_params
      params.require(:user).permit(:gender, :phone, :qq)
    end

    def pp_params
      params.require(:user).permit(:pp_question, :pp_answer)
    end

    def bind_name_params
      params.require(:user).permit(:real_name, :id_type, :id_number, :phone)
    end

    def bank_params
      params.require(:user_bank).permit(:name, :card_number, :branch_name, :address)
    end

    def validate_my_code(code)
      if session["validate_code"].present? && session["validate_code_send_time"].present?
        last_send_duration = Time.now - session["validate_code_send_time"].to_datetime
        if last_send_duration > 10*60
          flash[:error] = "validate code timeout, please send again!"
        else
          if code == session["validate_code"]
            return true
          else
            flash[:error] = "validate code not right!"
          end
        end
      else
        flash[:error] = "please send validate code!"
      end
      return false
    end

    #error_respond={"error_response"=>{"code"=>15, "msg"=>"Remote service error", "sub_code"=>"isv.BUSINESS_LIMIT_CONTROL", "sub_msg"=>"触发业务流控", "request_id"=>"3b4kmfzkvbq7"}}
    #success_respond={"alibaba_aliqin_fc_sms_num_send_response"=>{"result"=>{"err_code"=>"0", "model"=>"104132741839^1105207555898", "success"=>true}, "request_id"=>"z24nkhmlp79h"}}
    def validate_alidayu_response(alidayu_response)
      error_message = "send fail! please resend!"
      if alidayu_response["error_response"]
        error_code = alidayu_response["error_response"]["code"]
        case error_code
        when 15
        when 40
          error_message = "please input your phone number"
        else
          error_message = alidayu_response["error_response"]["msg"]+":"+alidayu_response["error_response"]["sub_msg"]
        end
      else
        rresponse = alidayu_response["alibaba_aliqin_fc_sms_num_send_response"]["result"]
        if rresponse["success"] == true
          error_message = ""
        end
      end
      return error_message
    end
  end
end

require 'rails_helper'

RSpec.describe User, type: :model do
  let!( :user ) { create :user }

  it "user can change password" do
    expect( user.password).to eq "please123"
    user.change_password({"current_password"=> 'please123', "password"=> '123please', "password_confirmation"=> '123please'})
    expect( user.password).to eq "123please"
  end

  it "user can change money password" do
    expect( user.money_password).to eq "please123"
    user.change_password({"current_money_password"=> 'please123', "money_password"=> '123please', "money_password_confirmation"=> '123please'})
    expect( user.money_password).to eq "123please"
  end

  it "user can change email" do
    expect( user.email).to eq "test3@example.com"
    user.set_email({"current_password"=> 'please123', "email"=> 'test4@example.com'})
    expect( user.email).to eq "test3@example.com"
    #TODO user click link to set email
  end

  it "user can change profile" do
    expect( user.gender).to eq "secret"
    expect( user.phone).to eq ""
    expect( user.qq).to eq ""
    user.update_attributes({"gender"=> 'male', "phone"=> '13876549876', "qq"=> '12234567'})
    expect( user.gender).to eq "male"
    expect( user.phone).to eq "13876549876"
    expect( user.qq).to eq "12234567"
  end

  it "user can set password protection" do
    expect( user.pp_question).to eq ""
    expect( user.pp_answer).to eq ""
    user.set_password_protection({"current_password"=> 'please123', "pp_question"=> 'are you ok', "pp_answer"=> 'yes'})
    expect( user.pp_question).to eq "are you ok"
    expect( user.pp_answer).to eq "yes"
  end

  let( :session ) { Hash.new}
  it "user can validate real name" do
    current_time = Time.now
    session["validate_phone"] = '13212345678'
    session["validate_code"] = '123456'
    session["validate_code_send_time"] = current_time

    expect( user.phone).to eq ""
    expect( user.real_name).to eq nil
    expect( user.id_type).to eq "id_card"
    expect( user.id_number).to eq nil
    user.bind_name(0,{"real_name"=> 'David', "id_type"=>'passport', "id_number"=>'123456', "phone"=> '13212345678', "validate_code"=>'123456'},
    {"validate_phone" => '13212345678', "validate_code" => '123456', "validate_code_send_time" => current_time})
    expect( user.phone).to eq "13212345678"
    expect( user.real_name).to eq "David"
    expect( user.id_type).to eq "passport"
    expect( user.id_number).to eq "123456"
  end

  it "user can bind bank" do
    expect( user.user_banks).to eq []
    user.bind_bank("please123", {"name"=> 'ICBC bank', "card_number"=> '1234567890', "branch_name"=> 'changxing', "address"=> 'xinggong street' })
    user_banks = user.user_banks
    expect( user_banks.size).to eq 1
    expect( user_banks[0].name).to eq "ICBC bank"
    expect( user_banks[0].card_number).to eq "1234567890"
    expect( user_banks[0].branch_name).to eq "changxing"
    expect( user_banks[0].address).to eq "xinggong street"
  end

end

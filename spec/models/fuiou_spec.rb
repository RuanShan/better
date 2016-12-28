require 'rails_helper'

RSpec.describe Gateway::Fuiou, type: :model do
  before(:each) { Gateway::Fuiou.mchnt_cd = "abc"; Gateway::Fuiou.mchnt_key = "123";
   }


  it "has pid and key" do
    expect(Gateway::Fuiou.mchnt_cd).to be_present
    expect(Gateway::Fuiou.mchnt_key).to be_present
  end

  it "should generate request url" do
    params = { order_id: "", order_amt: 0.01, iss_ins_cd: '0803010000' }
    url = Gateway::Fuiou::Service.create_yemadai_url( params )
    puts "url = #{url}"
    expect( url ).to be_present
  end

end

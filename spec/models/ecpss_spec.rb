require 'rails_helper'

RSpec.describe Gateway::Ecpss, type: :model do
  before(:each) { Gateway::Ecpss.mer_no = "abc"; Gateway::Ecpss.key = "123";
   }


  it "has pid and key" do
    expect(Gateway::Ecpss.mer_no).to be_present
    expect(Gateway::Ecpss.key).to be_present
  end

  it "should generate request url" do
    params = { BillNo: "", Amount: 0.01, ReturnURL: "", AdviceURL: "", OrderTime: DateTime.current.to_s(:number) }
    url = Gateway::Ecpss::Service.create_yemadai_url( params )
    puts "url = #{url}"
    expect( url ).to be_present
  end

end

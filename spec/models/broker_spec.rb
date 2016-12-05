require 'rails_helper'

RSpec.describe Broker, type: :model do
  let!( :broker_tree ) { create :broker_7level_tree }

  it "destory leave" do
    broker = broker_tree
    broker.reload
    expect( broker.descendants.count ).to eq( 7 )
    child = broker.children.first
    child.destroy
    broker.reload
    expect( broker.descendants.count ).to eq( 6 )
  end
end

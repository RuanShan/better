class AddBidCountToGameRounds < ActiveRecord::Migration[5.0]
  def change
    add_column :game_rounds, :bid_count, :integer, null: false, default: 0
  end
end

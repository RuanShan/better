@game_rounds = []
@games.each{|game|
   @game_rounds += FactoryGirl.create_list(:game_round, 3, game: game).to_a
}

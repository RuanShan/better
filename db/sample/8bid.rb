@game_rounds.each{|game_round|FactoryGirl.create(:bid, game_round: game_round, user: @user)}

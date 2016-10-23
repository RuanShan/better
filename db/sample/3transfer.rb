FactoryGirl.create_list(:transfer, 20, from_game_center: @game_centers.first, to_game_center: @game_centers.last, number:rand(999999999999) , amount:rand(9999), user: @user)

Rails.application.routes.draw do
  root to: 'visitors#index'
  devise_for :users
  resources :users do
    get 'account', on: :collection
  end



  

end

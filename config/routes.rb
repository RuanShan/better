Rails.application.routes.draw do
  resources :transfers
  resources :drawings
  resources :payment_methods
  root to: 'visitors#index'
  devise_for :users
  resources :users do
    get 'account', on: :collection
    get 'deposit', on: :collection
    get 'drawing', on: :collection
    get 'transfer', on: :collection
  end
  resources :deposits

  get '/account', to: "users#account", as: :account

end

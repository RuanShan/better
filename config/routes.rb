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
    get 'change_password', on: :member
    patch 'changepwd', on: :member
  end
  resources :deposits

  resources :messages do
    put 'read', on: :member
    put 'read', on: :collection
  end

  get '/account', to: "users#account", as: :account

end

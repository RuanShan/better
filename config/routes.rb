Rails.application.routes.draw do

  resources :bids do
    post 'search', on: :collection
  end
  resources :games
  resources :user_wallets
  resources :transfers do
    post 'search', on: :collection
  end
  resources :drawings do
    post 'search', on: :collection
  end
  resources :payment_methods

  devise_for :users              #会员
  devise_for :administrators      #管理员
  devise_for :brokers, controllers: {
        sessions: 'agent/sessions'
      }
             #代理

  resources :users do
    get 'account', on: :collection
    get 'deposit', on: :collection
    get 'drawing', on: :collection
    get 'transfer', on: :collection
    member do
      match 'change_password', via: [:get, :patch]
      match 'change_profile', via: [:get, :patch]
      get 'security_center'
      match 'set_email', via: [:get, :patch]
      match 'set_password_protection', via: [:get, :patch]
      match 'bind_name', via: [:get, :patch]
      match 'bind_bank', via: [:get, :post]
    end
  end

  resources :deposits do
    post 'search', on: :collection
  end

  resources :messages do
    put 'read', on: :member
    put 'read', on: :collection
  end

  get '/account', to: "users#account", as: :account

  namespace :admin do
    resources :deposits
    get '/', to: 'welcome#index', as: :root
  end
  namespace :agent do
    resources :deposits
    get '/', to: 'welcome#index', as: :root
  end

  root to: 'visitors#index'

end

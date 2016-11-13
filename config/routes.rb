Rails.application.routes.draw do

  resources :games
  resources :payment_methods

  devise_for :users              #会员
  devise_for :administrators      #管理员
  devise_for :brokers, controllers: {
        sessions: 'agent/sessions'
      }

  # 管理
  namespace :admin do
    resources :deposits
    resources :users do
      get :search, on: :collection
      delete :delete, on: :collection
    end
    resources :brokers do
      get :search, on: :collection
      delete :delete, on: :collection
    end
    resources :messages do
      get :search, on: :collection
      put :delete, on: :collection
      put :batch_send, on: :collection
      put :one_send, on: :member
    end
    get '/', to: 'welcome#index', as: :root
  end
  namespace :agent do
    resources :broker_days do
      get :profit, on: :collection
      get :children, on: :collection
      get :children_profit, on: :collection
    end
    resources :broker_months do
      get :profit, on: :collection
      get :balance, on: :collection
      get :children, on: :collection
      get :children_profit, on: :collection
      get :children_balance, on: :collection
    end
    resources :members do
      get :profit, on: :collection
    end
    resources :user_days
    resources :broker do
      match 'change_password', via: [:get, :patch]
    end
    resources :deposits
    get '/(:number)', to: 'welcome#index', as: :root
  end

  namespace :my do

    resources :account do
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
        get 'send_validate_code'
        match 'bind_bank', via: [:get, :post]
      end
    end

    resources :deposits do
      get 'search', on: :collection
    end

    resources :messages do
      put 'read', on: :member
      put 'read', on: :collection
      put 'delete', on: :collection
    end

    resources :bids do
      get 'search', on: :collection
    end
    resources :wallets do
      get 'bonuses', on: :collection
      get 'search_bonuses', on: :collection
    end

    resources :drawings do
      get 'search', on: :collection
    end

  end

  get '/ecpss_status/done/' => 'ecpss_status#done', :as => :ecpss_done
  post '/ecpss_status/notify/' => 'ecpss_status#notify', :as => :ecpss_notify

  #root to: 'visitors#index'
  get '/(:number)', to: 'visitors#index', as: :root

end

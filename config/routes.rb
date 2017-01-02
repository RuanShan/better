Rails.application.routes.draw do
  #captcha
  mount RuCaptcha::Engine => "/rucaptcha"

  resources :games
  resources :game_rounds
  resources :payment_methods

  #会员
  devise_for :users, controllers: {  sessions: 'sessions', registrations: 'registrations' }

  devise_scope :user do
    get 'invitable_sign_up/:inviter_number', to: 'registrations#new', as: :invitable_sign_up
  end

  devise_for :brokers, controllers: {
        sessions: 'agent/sessions',
        registrations: 'agent/registrations'
  }
  devise_for :administrators , controllers: {
        sessions: 'admin/sessions'
  }     #管理员

  # 管理
  namespace :admin do
    resources :administrators do
      put :batch_delete, on: :collection
    end
    resources :game_instruments do
      put :hot, on: :member
      collection do
        get :search
        put :batch_delete
        put :batch_hot
        put :batch_rate
      end
    end

    resources :deposits
    resources :drawings do
      collection do
        get :search
        put :batch_pass
        put :batch_deny
      end
      member do
        put :pass
        put :deny
      end
    end
    resources :promotions do
      collection do
        get :search
        put :batch_delete
      end
    end
    resources :users do
      resources :user_banks
      collection do
        get :search
        put :batch_delete
        put :batch_lock
      end
      member do
        get :record
        get :data
        put :lock
        match :change_login_password, via: [:get, :patch]
        match :change_money_password, via: [:get, :patch]
        match :password_protect, via: [:get, :patch]
      end
    end
    resources :brokers do
      collection do
        get :search
        put :batch_delete
        put :batch_confirm
        put :batch_lock
      end
      member do
        get :data
        get :image
        get :report
        put :confirm
        put :lock
      end
    end
    resources :messages do
      get :search, on: :collection
      put :batch_delete, on: :collection
      put :batch_send, on: :collection
      put :one_send, on: :member
    end
    get '/', to: 'welcome#index', as: :root
  end
  namespace :agent do
    resources :sale_days do
      get :profit, on: :collection
      get :children, on: :collection
      get :children_profit, on: :collection
    end
    resources :sale_months do
      get :profit, on: :collection
      get :balance, on: :collection
      get :children, on: :collection
      get :children_profit, on: :collection
      get :children_balance, on: :collection
    end
    resources :members do
      get :profit, on: :collection
      get :brokers, on: :collection
      get :pingtai, on: :collection # FIXME later
      get :yilou, on: :collection # FIXME later
    end
    resources :user_days
    resources :broker do
      get "notify", on: :collection
      match 'change_password', via: [:get, :patch]
    end
    resources :user, only: [:index]

    resources :deposits
    get '/page_broker', to: 'welcome#page_broker'
    get '/product', to: 'welcome#product'
    get '/commission', to: 'welcome#commission'
    get '/clause', to: 'welcome#clause'
	  get '/activity', to: 'welcome#activity'
    get '/(:number)', to: 'welcome#index', as: :root
  end

  namespace :my do

    resources :account do

      collection do
        get 'trade1'
        get 'trade2'
        get 'deposit'
        get 'drawing'
        get 'transfer'
        get 'reward'
        get 'invitable_qrcode'
        post 'test_nickname'
      end
      member do
        match 'change_password', via: [:get, :patch]
        match 'change_profile', via: [:get, :patch]
        match 'update_profile', via: [:patch]
        match 'community_set', via: [:get, :patch]
        get 'security_center'
        match 'set_email', via: [:get, :patch]
        match 'set_password_protection', via: [:get, :patch]
        match 'bind_name', via: [:get, :patch]
        get 'send_validate_code'
        match 'bind_bank', via: [:get, :post]
        #for mobile only
        match 'edit_login_password', via: [:get, :patch]
        match 'edit_money_password', via: [:get, :patch]
        patch 'collect'
      end
    end

    resources :deposits do
      collection do
        get 'search'
        get 'domestic_new'
        get 'foreign_new'
      end
    end

    resources :messages do
      put 'read', on: :member
      put 'read', on: :collection
      put 'delete', on: :collection
    end

    resources :bids do
      get 'search', on: :collection
      post 'simulate', on: :collection
      put 'simulate_update', on: :collection
    end
    resources :wallets do
      get 'bonuses', on: :collection
      get 'search_bonuses', on: :collection
    end

    resources :drawings do
      get 'search', on: :collection
    end

    resources :user_banks
  end

  post '/sms/create_verify_code', to: 'sms#create_verify_code'

  get '/fuiou_status/goto_gateway' => 'fuiou_status#goto_gateway', :as => :fuiou_goto_gateway
  post '/fuiou_status/done/' => 'fuiou_status#done', :as => :fuiou_done
  post '/fuiou_status/notify/' => 'fuiou_status#notify', :as => :fuiou_notify

  #root to: 'visitors#index'
  get '/(:number)', to: 'visitors#index', as: :root

  # config/routes.rb
  get "/pages/*id" => 'pages#show', as: :page, format: false

end

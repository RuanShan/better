Rails.application.routes.draw do

  resources :transfers
  resources :drawings
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
  end
  resources :deposits

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

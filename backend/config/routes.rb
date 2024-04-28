Rails.application.routes.draw do
  # google認証にアクセス
  get '/auth/:provider/callback', to: 'sessions#create'
  
  mount ActionCable.server => '/ws'
  post '/registrations', to: 'registrations#create'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  root to: proc { [200, {}, ["Hello, world!!! Auto Deploy!!!!"]] }

  # ユーザー登録のルート(API)
  namespace :api do
    namespace :v1 do
	    # カレントユーザーの呼び出し
      get 'users/current', to: 'users#current'
      resources :items, only: [:index]
      resources :users do
        resources :avatars, only: [:create]
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

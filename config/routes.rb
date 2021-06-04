Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      get 'assets/index/:user_id', to: 'assets#index'
      post 'assets/create'
      delete 'assets/destroy/:id', to: 'assets#destroy'
      put 'assets/update/:id', to: 'assets#update'
      get 'assets/refresh/:user_id', to: 'assets#refresh'

      post '/login',    to: 'sessions#create'
      post '/logout',   to: 'sessions#destroy'
      get '/logged_in', to: 'sessions#is_logged_in?'
    
      post '/users',         to: 'users#create'
      get '/users/:user_id', to: 'users#show'
      get '/users',          to: 'users#index'
    end
  end

  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

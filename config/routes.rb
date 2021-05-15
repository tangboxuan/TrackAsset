Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'assets/index'
      post 'assets/create'
      # get 'assets/show'
      delete 'assets/destroy/:id', to: 'assets#destroy'
      put 'assets/update/:id', to: 'assets#update'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

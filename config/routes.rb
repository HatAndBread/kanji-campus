Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "pages#home"
  get "/menu", to: "pages#menu", as: "menu"

  resources :study_sets do
    resources :writing_sessions, only: [:index]
    resources :reading_sessions, only: [:index]
  end
  resources :writing_sessions, only: [:update]
  resources :reading_sessions, only: [:update]
  get "/privacy_policy", to: "pages#privacy_policy", as: "privacy_policy"
  get "/service-worker.js" => "service_worker#service_worker"
  get "/manifest.json" => "service_worker#manifest"
end

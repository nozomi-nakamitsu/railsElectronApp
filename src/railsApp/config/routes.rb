Rails.application.routes.draw do
  devise_for :users
  get '/', to: 'videos#index'
  get '/BasicVieoCall', to: 'videos#BasicVieoCall'
end

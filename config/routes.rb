# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'callbacks' }
  resources :users
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  root 'zilog#index'
  get  '/',              to: 'zilog#index'
  get  '/disasm',        to: 'zilog#disasm'
  post '/disasm',        to: 'zilog#disasm'
  get  '/emulator',      to: 'zilog#emulator'
  post '/compile',       to: 'zilog#compile'
  get  'download_tap',   to: 'zilog#download_tap'
  get  'download_sna',   to: 'zilog#download_sna'
  get  'download_hob',   to: 'zilog#download_hob'
  get  'download_cod',   to: 'zilog#download_cod'
  get  '/converter_hex', to: 'zilog#converter_hex'
  post '/converter_hex', to: 'zilog#converter_hex'
  get  '/converter_dec', to: 'zilog#converter_dec'
  post '/converter_dec', to: 'zilog#converter_dec'
end

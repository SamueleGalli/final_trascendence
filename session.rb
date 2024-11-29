require 'sinatra'
require_relative 'config'
require 'json'

# Abilita la gestione delle sessioni
enable :sessions
set :session_secret, SecureRandom.hex(64)

# Route principale (home)
get '/' do
  send_file File.join(__dir__, 'public', 'index.html')
end

get '/auth/login' do
  if session[:access_token]
    content_type :json
    { authenticated: true }.to_json
  else
    redirect_uri = ENV['REDIRECT_URI']
    auth_url = CLIENT.auth_code.authorize_url(redirect_uri: redirect_uri)
    content_type :json
    { auth_url: auth_url }.to_json
  end
end

get '/auth/callback' do
  content_type :json
  { success: true }.to_json
end

# Endpoint per verificare se l'utente è autenticato
get '/check_auth' do
  if session[:access_token]
    content_type :json
    { authenticated: true }.to_json
  else
    content_type :json
    { authenticated: false }.to_json
  end
end

get '/logout' do
  session.clear
  content_type :json
  { success: true }.to_json
end

get '/callback' do
  auth_code = params[:code]
  redirect_uri = ENV['REDIRECT_URI']

  begin
    # Recupera il token usando il codice di autorizzazione
    token = CLIENT.auth_code.get_token(auth_code, redirect_uri: redirect_uri)

    # Salva il token nella sessione
    session[:access_token] = token.token

    # Invia la risposta JSON senza fare un redirect
    content_type :json
    { success: true, access_token: token.token }.to_json
  rescue OAuth2::Error => e
    # In caso di errore nell'autenticazione, invia un messaggio di errore
    content_type :json
    { success: false, error: e.message }.to_json
  end
end
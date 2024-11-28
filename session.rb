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
  # Verifica se l'utente è già autenticato (ha un token valido)
  if session[:access_token]
    # Se già autenticato, reindirizza l'utente alla home
    redirect '/'
  else
    # Altrimenti, genera l'URL di autorizzazione OAuth2
    redirect_uri = ENV['REDIRECT_URI']
    auth_url = CLIENT.auth_code.authorize_url(redirect_uri: redirect_uri)
    
    # Reindirizza l'utente direttamente all'URL di autorizzazione
    redirect auth_url
  end
end


get '/auth/callback' do
  auth_code = params[:code]
  redirect_uri = ENV['REDIRECT_URI']

  begin
    # Otteniamo il token di accesso usando il codice di autorizzazione
    token = CLIENT.auth_code.get_token(auth_code, redirect_uri: redirect_uri)

    # Salviamo il token nella sessione
    session[:access_token] = token.token

    # Redirect alla home page o una pagina protetta
    redirect '/'
  rescue OAuth2::Error => e
    # In caso di errore nell'autenticazione, mostra un messaggio
    puts "Errore nell'autenticazione: #{e.message}"
    redirect '/'
  end
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

# Endpoint per il logout
get '/logout' do
  session.clear
  redirect '/'
end

# Definisci la route /callback
get '/callback' do
  auth_code = params[:code]
  redirect_uri = ENV['REDIRECT_URI']

  # Recupera il token usando il codice di autorizzazione
  token = CLIENT.auth_code.get_token(auth_code, redirect_uri: redirect_uri)

  # Salva il token nella sessione
  session[:access_token] = token.token

  # Redirect alla home page dopo il login
  redirect '/'
end


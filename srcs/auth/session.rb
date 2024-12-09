require 'sinatra'
require_relative 'config'
require 'json'
require 'oauth2'
require 'net/http'

# Abilita la gestione delle sessioni
enable :sessions
set :session_secret, SecureRandom.hex(64)

# Hash globale per memorizzare gli utenti in memoria (prova)
$users = {}

# Route principale (home)
get '/' do
  send_file File.join(__dir__, '/public/', 'index.html')
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
  code = params[:code]
  if code.nil? || code.empty?
    content_type :json
    { success: false, error: "No authorization code received" }.to_json
    return
  end

  redirect_uri = ENV['REDIRECT_URI']
  begin
    # Ottieni il token
    token = CLIENT.auth_code.get_token(code, redirect_uri: redirect_uri)
    session[:access_token] = token.token

    user_info = token.get('https://api.intra.42.fr/v2/me')
    user_data = JSON.parse(user_info.body)

    name = user_data['login']  # Nome
    email = user_data['email']      # Email
    image = user_data['image_url']  # URL dell'immagine del profilo
    
    puts 'Name: ' + name
    puts 'Email: ' + email

    content_type :json
    # Mostra una pagina HTML con il messaggio di successo
    html_content = <<-HTML
      <html>
        <head><title>Accesso Consentito</title></head>
        <body>
          <h1>Accesso consentito</h1>
          <p>Clicca continua per finire l'autenticazione.</p>
          <button id="continueButton">Continua</button>
          <script>
            document.getElementById('continueButton').addEventListener('click', function() {
                if (window.opener) {
                    window.opener.postMessage({ authenticated: true }, window.location.origin);
                    window.close(); // Chiude la popup
                } else {
                    console.error('window.opener non trovato');
                }
            });
          </script>
        </body>
      </html>
    HTML

    # Restituisci la pagina HTML
    content_type :html
    body html_content

  rescue OAuth2::Error => e
    content_type :json
    { success: false, error: e.message, response: e.response.body }.to_json
  end
end
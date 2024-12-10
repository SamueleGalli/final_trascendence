require_relative 'main'
require 'rack'
require 'json'
require 'oauth2'
require 'net/http'
require 'pg'
require 'puma'
load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')

login = BetterPG::SimplePG.new "users", ["name TEXT", "email TEXT", "token TEXT", "image TEXT"]

# Creazione dell'app Rack
app = Rack::Builder.new do
  use Rack::Session::Cookie, secret: SecureRandom.hex(64)

  run lambda { |env|
    request = Rack::Request.new(env)
    response = Rack::Response.new

    case request.path
    when '/'
      # Serve il file HTML della homepage
      response.write(File.read(File.join(__dir__, 'public', 'index.html')))
      response.content_type = 'text/html'

    when '/auth/login'
      # Verifica se l'utente è autenticato
      if request.session[:access_token]
        response.content_type = 'application/json'
        response.write({ authenticated: true }.to_json)
      else
        redirect_uri = ENV['REDIRECT_URI']
        auth_url = CLIENT.auth_code.authorize_url(redirect_uri: redirect_uri)
        response.content_type = 'application/json'
        response.write({ auth_url: auth_url }.to_json)
      end

    when '/check_auth'
      # Verifica lo stato dell'autenticazione
      if request.session[:access_token]
        response.content_type = 'application/json'
        response.write({ authenticated: true }.to_json)
      else
        response.content_type = 'application/json'
        response.write({ authenticated: false }.to_json)
      end

    when '/logout'
      # Gestisce il logout, cancellando la sessione
      request.session.clear
      response.content_type = 'application/json'
      response.write({ success: true }.to_json)

    when '/callback'
      # Gestisce la callback dell'autenticazione OAuth
      code = request.params['code']
      if code.nil? || code.empty?
        response.content_type = 'application/json'
        response.write({ success: false, error: "No authorization code received" }.to_json)
        return
      end

      redirect_uri = ENV['REDIRECT_URI']
      begin
        # Ottieni il token OAuth
        token = CLIENT.auth_code.get_token(code, redirect_uri: redirect_uri)
        request.session[:access_token] = token.token

        # Ottieni informazioni utente tramite il token
        user_info = token.get('https://api.intra.42.fr/v2/me')
        user_data = JSON.parse(user_info.body)

        name = user_data['login']
        email = user_data['email']
        image = user_data['image_url']

        # Salva i dati nel database
        login.addValues ["'" + name + "'", "'" + email + "'", "'" + token.token + "'", "'" + image + "'"], ["name", "email", "token", "image"]

        # Mostra il risultato all'utente
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

        # Rispondi con la pagina HTML
        response.content_type = 'text/html'
        response.write(html_content)

      rescue OAuth2::Error => e
        response.content_type = 'application/json'
        response.write({ success: false, error: e.message, response: e.response.body }.to_json)
      end

    when '/guest'
      # Gestione della route POST /guest
      if request.request_method == 'POST'
        guest_name = request.params['guest_name']

        if guest_name.nil? || guest_name.strip.empty?
          response.status = 400
          response.write({ success: false, error: "Guest name is required" }.to_json)
        else
          # Salva il nome del guest nella sessione
          request.session[:guest_name] = guest_name
          login.addValues ["'" + guest_name + "'", "'" + "NULL" + "'", "'" + "NULL" + "'", "'" + "NULL" + "'"], ["name", "email", "token", "image"]
          response.write({ success: true, guest_name: guest_name }.to_json)
        end
      else
        # Route non trovata o metodo non supportato
        response.status = 404
        response.write({ success: false, error: "Not Found" }.to_json)
      end

    else
      # Se la rotta non è definita, restituisci un errore 404
      response.status = 404
      response.content_type = 'application/json'
      response.write({ success: false, error: "Not Found" }.to_json)
    end

    response.finish
  }
end

# Avvio del server Puma
Puma::Server.new(app).tap do |server|
  # Configura Puma per ascoltare sulla porta 4567
  server.add_tcp_listener('0.0.0.0', 4567)
end.run
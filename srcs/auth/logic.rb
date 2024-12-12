require 'net/http'
#require 'pg'

#load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')

#login = BetterPG::SimplePG.new "users", ["name TEXT", "email TEXT", "token TEXT", "image TEXT"]

# auth_methods.rb
module AuthMethods
    def login(request, response, client)
      if request.session[:access_token]
        response.content_type = 'application/json'
        response.write({ authenticated: true }.to_json)
      else
        auth_url = client.auth_url
        response.content_type = 'application/json'
        response.write({ auth_url: auth_url }.to_json)
      end
    end
  
    def check_authentication(request, response)
      if request.session[:access_token]
        response.content_type = 'application/json'
        response.write({ authenticated: true }.to_json)
      else
        response.content_type = 'application/json'
        response.write({ authenticated: false }.to_json)
      end
    end
  
    def logout(request, session_manager, response)
      session_manager.clear(request)
      response.content_type = 'application/json'
      response.write({ success: true }.to_json)
    end
  
    def guest(request, response)
      # Gestione della route POST /guest
      if request.request_method == 'POST'
        guest_name = request.params['guest_name']
    
        if guest_name.nil? || guest_name.strip.empty?
          response.status = 400
          response.write({ success: false, error: "Guest name is required" }.to_json)
        else
          # Salva il nome del guest nella sessione
          request.session[:guest_name] = guest_name
          #login.addValues ["'" + guest_name + "'", "'" + "NULL" + "'", "'" + "NULL" + "'", "'" + "NULL" + "'"], ["name", "email", "token", "image"]
          response.write({ success: true, guest_name: guest_name }.to_json)
        end
      else
        # Route non trovata o metodo non supportato
        response.status = 404
        response.write({ success: false, error: "Not Found" }.to_json)
      end
    end    
    def callback(request, response, client, session_manager)
      code = request.params['code']
      if code.nil? || code.empty?
        response.content_type = 'application/json'
        response.write({ success: false, error: "No authorization code received" }.to_json)
        return
      end
      # Ottieni il token
      token = client.get_token(code)
      session_manager.store_access_token(request, token)
    
      # Recupera i dati dell'utente (modifica con il metodo effettivo del tuo client)
      user_data = get_user_data_from_oauth_provider(token)
    
      # Estrai le informazioni desiderate
      name = user_data['login']  # Nome dell'utente
      email = user_data['email']  # Email dell'utente
      image = user_data['image_url']  # URL dell'immagine dell'utente
      
      # Aggiungi i dati utente nel database (o in un'altra logica)
      #login.addValues ["'" + name + "'", "'" + email + "'", "'" + token.token + "'", "'" + image + "'"], ["name", "email", "token", "image"]
    
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
                      window.close();
                  } else {
                      console.error('window.opener non trovato');
                  }
              });
            </script>
          </body>
        </html>
      HTML
      response.content_type = 'text/html'
      response.write(html_content)
    end
    def get_user_data_from_oauth_provider(token)
      # Esegui una richiesta HTTP per ottenere i dati dell'utente
      uri = URI("https://api.github.com/user")
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{token}"
  
      # Fai la richiesta
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(request)
      end
  
      # Elabora la risposta JSON
      user_data = JSON.parse(response.body)
  
      # Restituisci solo i dati necessari
      {
        'name' => user_data['name'],
        'email' => user_data['email'],
        'avatar_url' => user_data['avatar_url']
      }
    end
    def not_found(response)
      response.status = 404
      response.content_type = 'application/json'
      response.write({ success: false, error: "Not Found" }.to_json)
    end
  end
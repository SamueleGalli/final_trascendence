require 'net/http'
require 'uri'
require 'json'

module AuthMethods
  def login(request, response, client)
    puts "request.session[:access_token]: |" + request.session[:access_token].to_s
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

  def revoke_token(access_token)
    uri = URI.parse('https://oauth2.provider.com/revoke') # URL dell'endpoint di revoca del token
    request = Net::HTTP::Post.new(uri)
    request.set_form_data({ 'token' => access_token })

    # Esegui la richiesta di revoca con gestione degli errori
    begin
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(request)
      end

      if response.code == '200'
        puts "Token revocato con successo."
      else
        puts "Errore nella revoca del token: #{response.code} #{response.body}"
      end
    rescue => e
      puts "Errore durante la revoca del token: #{e.message}"
    end
  end

  def logout(request, session_manager, response)
    # Recupera il token di accesso dalla sessione o dal contesto
    access_token = request.cookies['access_token'] # O il metodo che stai usando per memorizzare il token
    
    # Se il token esiste, revoca il token
    if access_token
      revoke_token(access_token)
    end

    # Pulisci la sessione
    session_manager.clear(request)

    response.delete_cookie('access_token')

    # Risposta al client
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
        response.write({ success: true, guest_name: guest_name }.to_json)
      end
    else
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

    # Recupera i dati dell'utente
    user_data = get_user_data_from_oauth_provider(token)

    name = user_data['login']
    email = user_data['email']
    image = user_data['avatar_url']

    html_content = File.read('../login_module/auth_page.html')

    response.content_type = 'text/html'
    response.write(html_content)
  end

  def get_user_data_from_oauth_provider(token)
    uri = URI("https://api.github.com/user")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"

    # Fai la richiesta
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    # Elabora la risposta JSON
    user_data = JSON.parse(response.body)

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

require 'net/http'
require 'uri'
require 'json'
require 'cgi'
require_relative 'other_logic'

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

  def logout(request, response)
    # Rimuovi il cookie contenente il token
    response.delete_cookie('access_token', path: '/')
    request.session.delete(:access_token)  # Il token non c'è più
    # Rispondi
    response.content_type = 'application/json'
    response.write({ success: true, message: 'Logout effettuato con successo.' }.to_json)
  end

  def callback(request, response, client)
    code = request.params['code']
    if code.nil? || code.empty?
      response.content_type = 'application/json'
      response.write({ success: false, error: "No authorization code received" }.to_json)
      return
    end
    # Ottieni il token
    token = client.get_token(code)
    puts "token creato = #{token.token}"
    response.set_cookie('access_token', {
      value: token.token,
      path: '/',
      max_age: 3600,
      secure: true,    # Solo su HTTPS
      httponly: true   # Non accessibile tramite JavaScript
    })
    
    request.session[:authenticated] = true
    # Recupera i dati dell'utente
    user_data = get_user_data_from_oauth_provider(token)

    name = CGI.escapeHTML(user_data['login'])  # Escapare il nome
    email = CGI.escapeHTML(user_data['email'])  # Escapare l'email
    image = CGI.escapeHTML(user_data['avatar_url'])  # Escapare l'URL dell'immagine

    html_content = File.read('../login_module/auth_page.html')

    response.content_type = 'text/html'
    response.write(html_content)
  end
end
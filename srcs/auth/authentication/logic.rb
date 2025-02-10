require 'net/http'
require 'uri'
require 'json'
require 'cgi'
require 'erb'
require 'colorize'
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

  def callback(request, response, client)
    code = request.params['code']
    if code.nil? || code.empty?
      response.content_type = 'application/json'
      response.write({ success: false, error: "No authorization code received" }.to_json)
      return
    end
  
    token = client.get_token(code)
    response.set_cookie('access_token', {
      value: token.token,
      path: '/',
      max_age: 3600,
      secure: true,    # Solo su HTTPS
      httponly: true   # Non accessibile tramite JavaScript
    })
  
    request.session[:authenticated] = true
    request.session[:token] = token.token
  
    user_data = get_user_data_from_oauth_provider(token.token)
  
    if user_data.nil? || user_data.empty?
      response.content_type = 'application/json'
      response.write({ success: false, error: "Failed to fetch user data" }.to_json)
      return
    end
    name = CGI.escapeHTML(user_data['name'])
    email = CGI.escapeHTML(user_data['email'])
    image = CGI.escapeHTML(user_data['image'].to_s)
    login_name = CGI.escapeHTML(user_data['login_name'])
    user_data_js = {
      name: name,
      email: email,
      image: image,
      login_name: login_name
    }
    
    html_content = File.read('./pages_auth/auth_page.html')
    erb = ERB.new(html_content)
    html_output = erb.result(binding)
    
    response.content_type = 'text/html'
    response.write(html_output)
  end
  
end
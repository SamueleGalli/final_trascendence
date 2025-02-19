require 'net/http'
require 'uri'
require 'json'
require 'cgi'
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
      secure: true,    # Only on HTTPS
      httponly: true   # Not accessible via JavaScript
    })
  
    request.session[:authenticated] = true
    request.session[:token] = token.token
    get_user_data_from_oauth_provider(token.token)

    html_content = File.read('./pages_auth/auth_page.html')
    puts "getting html file...".yellow
    response.content_type = 'text/html'
    response.write(html_content)
  end
end
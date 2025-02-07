require 'rack'
require 'json'
require 'oauth2'
require 'rack'
require 'rack/session/cookie'
require 'securerandom'
require_relative 'Oauth'
require_relative 'logic'
require_relative 'other_logic'
require_relative 'granting_access'

class App
  include AuthMethods
  include Other_logic
  
  def initialize(client, logger)
    @client = client
    @logger = logger
    @app = Rack::Builder.new do
      use Rack::Session::Cookie, secret: SecureRandom.hex(64), expire_after: 3600
      run self
    end 
  end
  
  def call(env)
    request = Rack::Request.new(env)
    response = Rack::Response.new

    spa_routes = [
      '/modes', '/friends', '/stats', '/profile', '/classic', '/V.S._AI',
      '/tournament', '/forza4', '/forza4/game', '/forza4/userstats',
      '/settings', '/settings/customizepong', '/settings/customizeforza4',
      '/tournament/knockout', '/tournament/roundrobin', 
      '/tournament/roundrobin/robinranking', '/tournament/roundrobin/robinranking/game',
      '/tournament/userstats', '/tournament/userstats/matchdetails',
      '/tournament/knockout/bracket', '/tournament/knockout/bracket/game'
    ]
    #if request.path == '/set_authenticated'
    #  handle_set_authenticated(request, response)
    #  puts "\n\n\n\nvalore: #{request.session[:access_granted]}\n\n\n"
    #end
    #if spa_routes.include?(request.path) && !access_granted?(request)
    #  puts "\n\n\n\n\nerrore: #{request.path}\n\n\n\n\n"
    #  response.status = 200
    #  response['Content-Type'] = 'text/html'
    #  html_content = File.read('./pages_auth/not_authenticated_msg.html')
    #  response.write(html_content)
    #  return response.finish
    #else
    #  puts "\n\n\n\n\ntutto bene  #{request.path}\n\n\n\n\n"
    #end       

    case request.path
    when '/'
      response.write(File.read(File.join(__dir__, '../public', 'index.html')))
      response.content_type = 'text/html'

    when '/auth/login'
      login(request, response, @client)
  
    when '/callback'
      callback(request, response, @client)
  
    else
      if spa_route?(request.path)
        response.write(File.read(File.join(__dir__, '../public', 'index.html')))
        response.content_type = 'text/html'
      else
        page_not_found(response)
      end
    end
    response.finish
  end
end

def handle_set_authenticated(request, response)
  if request.request_method == 'POST'
    begin
      puts "\n\n\naccess_granted value: #{data['access_granted']}\n\n\n\n"
      request_body = request.body.read
      puts "Body Length: #{request_body.length}"  # Stampa la lunghezza del corpo per confermare che ci sia del contenuto
      puts "Body: #{request_body}"
      data = JSON.parse(request_body)
      if data["access_granted"]
        request.session[:access_granted] = true
        puts "Session after granting: #{request.session[:access_granted]}"
        response.status = 200
        response['Content-Type'] = 'application/json'
        response.write({ success: true }.to_json)
      else
        response.status = 400
        response['Content-Type'] = 'application/json'
        response.body = { success: false, message: 'Access Denied' }.to_json
      end
    rescue JSON::ParserError
      response.status = 400
      response['Content-Type'] = 'application/json'
      response.body = { success: false, message: 'Invalid JSON format' }.to_json
    rescue => e
      response.status = 500
      response['Content-Type'] = 'application/json'
      response.body = { success: false, message: "Internal Server Error: #{e.message}" }.to_json
    end
  else
    response.status = 405
    response['Content-Type'] = 'application/json'
    response.body = { success: false, message: 'Method Not Allowed' }.to_json
  end
end
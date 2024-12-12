require 'rack'
require 'json'
require 'oauth2'
require_relative 'Oauth'
require_relative 'manager'
require_relative 'logic'

class App
  include AuthMethods  # Include i metodi di autenticazione

  def initialize(client, session_manager, logger)
    @client = client
    @session_manager = session_manager
    @logger = logger
  end

  def call(env)
    request = Rack::Request.new(env)
    response = Rack::Response.new

    case request.path
    when '/'
      response.write(File.read(File.join(__dir__, 'public', 'index.html')))
      response.content_type = 'text/html'

    when '/auth/login'
      login(request, response, @client)

    when '/logout'
      logout(request, @session_manager, response)

    when '/callback'
      callback(request, response, @client, @session_manager)
    
    when '/guest'
      guest(request, response)
    else
      not_found(response)
    end

    response.finish
  end
end

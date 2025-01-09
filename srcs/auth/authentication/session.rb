require 'rack'
require 'json'
require 'oauth2'
require_relative 'Oauth'
require_relative 'logic'
require_relative 'other_logic'

class App
  include AuthMethods
  include Other_logic

  def initialize(client, logger)
    @client = client
    @logger = logger
  end

  def call(env)
    request = Rack::Request.new(env)
    response = Rack::Response.new

    case request.path
    when '/'
      response.write(File.read(File.join(__dir__, '../public', 'index.html')))
      response.content_type = 'text/html'

    when '/auth/login'
      login(request, response, @client)

    when '/callback'
      callback(request, response, @client)

    else
      not_found(response)
    end

    response.finish
  end
end

require 'rack'
require 'json'
require 'oauth2'
require 'mail'
require 'securerandom'
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

#    when '/send-verification-email'
#      email = request.params['email']
#      if email
#        send_verification_email(email)
#        response.write("Verification email sent to #{email}")
#      else
#        response.write("Email parameter missing.")
#      end

    else
      not_found(response)
    end

    response.finish
  end

  #def send_verification_email(email)
  #  token = SecureRandom.hex(16)  # Genera un token univoco
  #  verification_link = "http://your-website.com/verify-email?token=#{token}"
  #  Mail.deliver do
  #    to email
  #    from 'your-email@gmail.com'
  #    subject 'Email Verification'
  #    body "Click the link to verify your email: #{verification_link}"
  #  end
  #end
end

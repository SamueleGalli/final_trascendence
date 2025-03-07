require 'oauth2'
require 'dotenv'
require 'colorize'
Dotenv.load

class OAuthClient
  def initialize

    # Carica variabili d'ambiente dal file .env
    @client_id = ENV['CLIENT_ID']
    @client_secret = ENV['CLIENT_SECRET']
    @redirect_uri = ENV['REDIRECT_URI']
    raise "CLIENT_ID, CLIENT_SECRET, o REDIRECT_URI non sono configurati nel file .env" if @client_id.nil? || @client_secret.nil? || @redirect_uri.nil?
    @client = OAuth2::Client.new(
      @client_id,
      @client_secret,
      site: "https://api.intra.42.fr",
      authorize_url: "/oauth/authorize",
      token_url: "/oauth/token"
    )
  end

  def auth_url
    @client.auth_code.authorize_url(
      redirect_uri: @redirect_uri,
      scope: 'public',
      state: 'state_value'
    )
  end

  def get_token(code)
    @client.auth_code.get_token(code, redirect_uri: @redirect_uri)
  end
end

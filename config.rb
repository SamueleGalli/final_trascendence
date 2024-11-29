require 'sinatra'
require 'oauth2'
require 'dotenv'
require 'logger'
Dotenv.load

# Crea un nuovo logger
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

# Usa il logger personalizzato in Sinatra
configure do
  set :logger, logger
  # Disabilita Rack::Logger (evita il warning)
  set :logging, false
end

ENV['REDIRECT_URI'] ||= 'http://localhost:4567/callback'

CLIENT = OAuth2::Client.new(
  ENV['CLIENT_ID'],
  ENV['CLIENT_SECRET'],
  site: "https://api.intra.42.fr",
  authorize_url: "/oauth/authorize",
  token_url: "/oauth/token"
)

def exchange_code_for_token(code)
  # Scambia il codice con il token di accesso
  token = CLIENT.auth_code.get_token(code, redirect_uri: ENV['REDIRECT_URI'])
  return token.to_hash  # Restituisce i dati del token, inclusi access_token, refresh_token, ecc.
end

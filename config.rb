require 'oauth2'
require 'sinatra'
require 'json'
require 'logger'
require 'securerandom'

# Costanti per l'autenticazione
UID = "u-s4t2ud-d92dc37f98350dab3f74c31a492de6cd1db73874ba9f7798374123b4e2fa8672"
SECRET = "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"
REDIRECT_URI = "http://localhost:4567/callback"

# Creazione del client OAuth2, che verrà utilizzato in `session.rb`
CLIENT = OAuth2::Client.new(
  UID,
  SECRET,
  site: "https://api.intra.42.fr",
  authorize_url: "/oauth/authorize",
  token_url: "/oauth/token"
)

# Impostazioni di Sinatra
enable :sessions
set :session_secret, SecureRandom.hex(64)
set :port, 4567
set :logging, false
configure do
  set :logger, Logger.new(STDOUT)
  settings.logger.level = Logger::INFO
end

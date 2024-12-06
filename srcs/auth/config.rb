require 'sinatra'
require 'oauth2'
require 'dotenv'
require 'logger'

Dotenv.load

# Crea un nuovo logger per mostrare error e warning 
logger = Logger.new(STDOUT)
logger.level = Logger::INFO
set :bind, '0.0.0.0'

# Usa il nuovo logger disabilitando il vecchio
configure do
  set :logger, logger
  set :logging, false
end

redirect_uri = ENV['REDIRECT_URI']

if redirect_uri.nil? || redirect_uri.empty?
  raise "REDIRECT_URI non configurato nel file .env"
end

# Creo un CLIENT con id, secret, sito URL per l'autenticazione e il token ottenuto una volta essermi autenticato
CLIENT = OAuth2::Client.new(
  ENV['CLIENT_ID'],
  ENV['CLIENT_SECRET'],
  site: "https://api.intra.42.fr",
  authorize_url: "/oauth/authorize",
  token_url: "/oauth/token"
)

# Genera l'URL di autorizzazione da inviare al frontend
auth_url = CLIENT.auth_code.authorize_url(
  redirect_uri: redirect_uri,  # Usa il redirect URI configurato
  scope: 'public',              # Puoi personalizzare lo scope
  state: 'state_value'          # Se hai bisogno di un valore per lo stato
)

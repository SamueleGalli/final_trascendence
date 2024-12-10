require 'puma'
require 'rack'
require 'oauth2'
require 'dotenv'
require 'logger'
require_relative 'session'

Dotenv.load

$stdout.sync = true

logger = Logger.new(STDOUT)
logger.level = Logger::INFO

# Carica la variabile REDIRECT_URI dal file .env
redirect_uri = ENV['REDIRECT_URI']

# Se non è configurata, interrompi l'applicazione
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

# Gestisci il segnale di interruzione (Ctrl+C) in modo pulito
trap("INT") do
  puts "Chiusura del server in corso..."
  exit
end
require_relative 'session'
require_relative 'Oauth'
require_relative 'logic'
require 'rack/session/cookie'
require 'puma'

$stdout.sync = true
use Rack::Session::Cookie, secret: SecureRandom.hex(64)

# Crea l'app con i giusti argomenti
client = OAuthClient.new
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

use Rack::Static, urls: ["/favicon.ico", "/game_engine/css", "/game_engine/js", "/game_engine/images"], root: File.join(File.dirname(__FILE__), '../public')

# Definisci la tua app come una variabile
app = App.new(client, logger)

# Aggiungi la configurazione per SSL in produzione
if ENV['RACK_ENV'] == 'production'
  ssl_options = {
    cert: '../https/server.crt',   # Percorso del certificato
    key:  '../https/server.key',    # Percorso della chiave privata
    verify: 'none'                 # Imposta 'none' se non vuoi fare la verifica del certificato
  }

  # Configura Puma per usare HTTPS
  Puma::Server.new(app).tap do |server|
    server.add_ssl(ssl_options)  # Aggiungi la configurazione SSL
    server.run
  end
end

require_relative 'session'
require_relative 'Oauth'
require_relative 'logic'
require 'rack/session/cookie'
require 'puma'
require 'openssl'

$stdout.sync = true

# Crea l'app con i giusti argomenti
client = OAuthClient.new
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

use Rack::Session::Cookie, secret: SecureRandom.hex(64)

use Rack::Static, urls: ["/favicon.ico", "/game_engine/css", "/game_engine/js", "/game_engine/images"], root: File.join(File.dirname(__FILE__), '../public')
run App.new(client, logger)

# config.ru
require 'rack/session/cookie'
require_relative 'session'
require_relative 'Oauth'
require_relative 'manager'
require_relative 'logic'
use Rack::Session::Cookie, secret: SecureRandom.hex(64)


# Crea l'app con i giusti argomenti
client = OAuthClient.new
session_manager = SessionManager.new
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

use Rack::Static, urls: ["/game_engine/css", "/game_engine/js", "/game_engine/images"], root: File.join(File.dirname(__FILE__), 'public')
run App.new(client, session_manager, logger)

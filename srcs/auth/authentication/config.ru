require 'rack'
require 'puma'
require 'securerandom'
require 'logger'
require 'rack/session/cookie'
require 'socket'
require 'timeout'
require_relative 'Oauth'
require_relative 'session'

$stdout.sync = true

client = OAuthClient.new
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

use Rack::Session::Cookie, secret: SecureRandom.hex(64)
use Rack::Static, urls: ["/game_engine/authentication", "/game_engine/js", "/game_engine/images", "/game_engine/css"], root: File.expand_path('public', __dir__)

app = App.new(client, logger)

run app
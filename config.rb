require 'oauth2'
require 'sinatra'
require 'json'
require 'logger'
require 'dotenv'

Dotenv.load  # Load environment variables from the .env file

ENV['REDIRECT_URI'] ||= 'http://localhost:4567/callback'  # Aggiungi questa riga

# OAuth2 client creation
CLIENT = OAuth2::Client.new(
  ENV['CLIENT_ID'],
  ENV['CLIENT_SECRET'],
  site: "https://api.intra.42.fr",
  authorize_url: "/oauth/authorize",
  token_url: "/oauth/token"
)

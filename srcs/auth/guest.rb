require 'sinatra'
require 'securerandom'

enable :sessions
set :session_secret, SecureRandom.hex(64)

post '/guest' do
    guest_name = params['guest_name']
    if guest_name.nil? || guest_name.strip.empty?
      status 400
      return { success: false, error: "Guest name is required" }.to_json
    end
    session[:guest_name] = guest_name  # Salva il nome del guest nella sessione
    { success: true, guest_name: guest_name }.to_json
end
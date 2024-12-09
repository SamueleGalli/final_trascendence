require 'sinatra'
#require 'webrick'
require_relative 'session'
require_relative 'guest'

$stdout.sync = true

#cartella file statici pagina e altro
#ia_path = File.expand_path('', __dir__ + "/public")

#server webrick per il gioco
#game_server = WEBrick::HTTPServer.new(
#  Port: 8005,
#  DocumentRoot: ia_path
#)

# wbrick servira i file nella cartella public quando l'utente fare una richiesta url /
#game_server.mount('/', WEBrick::HTTPServlet::FileHandler, ia_path)

# Gestisci l'interruzione del server con CTRL+C
trap("INT") { game_server.shutdown }

# Avvia il server WEBrick in un thread separato per non bloccare il server Sinatra
#Thread.new { game_server.start }

# Avvia il server Sinatra (per il login e la gestione della sessione) sulla porta 4567
Sinatra::Application.set(:port, 4567)

# Avvia il server Sinatra
Sinatra::Application.run!

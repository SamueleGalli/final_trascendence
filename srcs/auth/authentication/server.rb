require 'webrick'
require 'colorize'
require_relative 'Oauth'
require_relative 'session'

logger = Logger.new(STDOUT)
logger.level = Logger::ERROR
$stdout.sync = true

# Creazione dell'oggetto WebApp con OAuth client e logger
app = App.new(OAuthClient.new, logger)

# Configurazione server WEBrick
server = WEBrick::HTTPServer.new(Port: 9292)

# Montaggio dell'applicazione principale
server.mount_proc '/' do |req, res|
    status, headers, body = app.call(req.meta_vars)
    res.status = status
    headers.each { |k, v| res[k] = v }
    body.each { |chunk| res.body << chunk }

    # Log degli errori generali
    if status >= 400  # Tutti gli errori (400 e superiori)
    logger.error("#{status} Error: #{req.path}".red)
    end
end

def log_error_details(req, status, body)
    # Log degli errori dettagliati solo per gli errori più gravi
    if status >= 400
        ip = req.peeraddr[3]
        method = req.request_method
        path = req.path
        headers = req.header.to_s
        body_content = body.join

        error_message = "ERROR #{status} - #{method} #{path} from #{ip}\n"
        error_message += "Request Headers: #{headers}\n"
        error_message += "Response Body: #{body_content[0..500]}\n"
        
        case status
        when 404
        logger.error(error_message.red)  # 404 in rosso
        when 500
        logger.error(error_message.bold.red)  # 500 in rosso e bold
        when 403
        logger.error(error_message.yellow)  # 403 in giallo
        when 400
        logger.error(error_message.light_red)  # 400 in rosso chiaro
        else
        logger.error(error_message)  # Errori generali
        end
    end
end

public_dir = File.expand_path("../../public", __FILE__)
game_engine_dir = File.join(public_dir, "game_engine")

server.mount "/game_engine/css", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "css")
server.mount "/game_engine/js", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "js")
server.mount "/game_engine/images", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "images")
server.mount "/game_engine/login", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "login")

server.mount "/favicon.ico", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "favicon.ico")

# Gestione dell'arresto del server
trap 'INT' do
    logger.info "Shutting down WEBrick server..."
    # Termina il processo (se si desidera)
    pid = Process.pid
    logger.info "Terminating process with PID #{pid}".red
    Process.kill('TERM', pid)  # Questo invia il segnale TERM al processo corrente
    server.shutdown
end

puts "Starting WEBrick server on port 9292..."
server.start

require 'webrick'
require 'colorize'
require_relative 'Oauth'
require_relative 'session'

# Creazione del logger
logger = Logger.new(STDOUT)

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
        logger.error(error_message.red)
    when 500
        logger.error(error_message.bold.red)
    when 403
        logger.error(error_message.yellow)
    when 400
        logger.error(error_message.light_red)
    else
        logger.error(error_message)
    end
end

# Montaggio dei file statici
['game_engine/css', 'game_engine/js', 'game_engine/images', 'game_engine/login', 'favicon.ico'].each do |path|
    server.mount "/#{path}", WEBrick::HTTPServlet::FileHandler, File.join(__dir__, "..", 'public', path)
end  

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

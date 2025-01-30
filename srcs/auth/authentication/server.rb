require 'webrick'
require 'colorize'
require_relative 'Oauth'
require_relative 'session'

load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../../common_tools/tools/Ports.rb')

#load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')

$stdout.sync = true

SERVICE_NAME = "auth"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

logger = Logger.new(STDOUT)
logger.level = Logger::ERROR
app = App.new(OAuthClient.new, logger)
server = WEBrick::HTTPServer.new(Port: PORT)

server.mount_proc '/' do |req, res|
  status, headers, body = app.call(req.meta_vars)
  res.status = status
  headers.each { |k, v| res[k] = v }
  body.each { |chunk| res.body << chunk }


  if status >= 400 
  logger.error("#{status} Error: #{req.path}".red)
  end
end

def log_error_details(req, status, body)

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
end

public_dir = File.expand_path("../../public", __FILE__)
game_engine_dir = File.join(public_dir, "game_engine")

server.mount "/game_engine/css", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "css")
server.mount "/game_engine/js", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "js")
server.mount "/game_engine/images", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "images")
server.mount "/game_engine/login", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "login")
server.mount "/favicon.ico", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "favicon.ico")
server.mount "/game_engine/pages", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "pages")


#server.mount_proc '/' do |req, res|
#  path = File.join(public_dir, req.path)
#  if File.exist?(path) && req.path =~ /\.\w+$/
#    res.body = File.read(path)
#  else
#    index_file = File.join(public_dir, "index.html")
#    if File.exist?(index_file)
#      res.body = File.read(index_file)
#      res['Content-Type'] = 'text/html'
#    else
#      res.status = 404
#      res.body = "404 Not Found"
#    end
#  end
#end

trap 'INT' do
  logger.info "Shutting down WEBrick server..."

  pid = Process.pid
  logger.info "Terminating process with PID #{pid}".red
  Process.kill('TERM', pid) 
  server.shutdown
end

announceAddress
print "Balls.\n"  # IDK but without this the next line is not printed
puts "Starting WEBrick server on port " + PORT.to_s + "..."
server.start

# server.rb
require 'webrick'
require 'colorize'
require_relative 'Oauth'
require_relative 'session'
require_relative 'error_logger'
require_relative 'handle_route'
load((File.file?('/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../../common_tools/tools/Ports.rb'))

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

server.mount_proc '/reload' do |req, res|
  status, headers, body = app.call(req.meta_vars)
  res.status = status
  headers.each { |k, v| res[k] = v }
  body.each { |chunk| res.body << chunk }
  if status >= 400
    logger.error("#{status} Error: #{req.path}".red)
  end
end

set_routes(server)

trap 'INT' do
  logger.info "Shutting down WEBrick server..."
  pid = Process.pid
  logger.info "Terminating process with PID #{pid}".red
  Process.kill('TERM', pid)
  server.shutdown
end

announceAddress
puts "Starting WEBrick server on port #{PORT}..."
server.start
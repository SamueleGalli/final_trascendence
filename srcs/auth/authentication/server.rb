require 'webrick'
require 'colorize'
require_relative 'Oauth'
require_relative 'session'
require_relative 'error_logger'
require_relative 'handle_route'

module WEBrick
  class Log
    alias original_log log

    def log(level, message)
      case level
      when WEBrick::Log::INFO
        message = message.blue
      when WEBrick::Log::WARN
        message = message.yellow
      when WEBrick::Log::ERROR
        message = message.red
      when WEBrick::Log::FATAL
        message = message.bold.red
      end
      original_log(level, message)
    end
  end
end

load((File.file?('/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../../common_tools/tools/Ports.rb'))
$stdout.sync = true

SERVICE_NAME = "auth"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

logger = Logger.new(STDOUT)
logger.level = Logger::DEBUG

app = App.new(OAuthClient.new, logger)

server = WEBrick::HTTPServer.new(
  Port: PORT,
  DocumentRoot: File.expand_path("../../public", __FILE__),
  RequestCallback: proc { |req, res| res['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0' }
)


server.mount_proc '/' do |req, res|
  status, headers, body = app.call(req.meta_vars)
  res.status = status
  headers.each { |k, v| res[k] = v }
  log_error_details(req, status, body, logger)

  if body.is_a?(String)
    res.body = body
  else
    body.each { |chunk| res.body << chunk }
  end

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
puts "Starting WEBrick server on port #{PORT}...".yellow
server.start

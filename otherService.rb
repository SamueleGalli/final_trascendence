# main.rb

# require 'timeout'
require 'json'

load ((File.file? '/var/www/common/Ports.rb') ? '/var/www/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/www/common/RequestUnpacker.rb') ? '/var/www/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')


load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "sample_service"

USR = BetterPG::SimplePG.new "users", ["id INT", "username TEXT", "password TEXT", "token TEXT"]

def sample_service_loop(client, server)

end

PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

print "lolresponse active at port ", PORT, "\n"
(SimpleServer::SimplerTCP.new PORT, :sample_service_loop).start_loop



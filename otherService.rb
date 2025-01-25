# main.rb

# require 'timeout'
require 'json'

load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')


load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "sample_service"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

LOGIN = BetterPG::SimplePG.new "users", ["login_name TEXT", "name TEXT", "email TEXT", "image TEXT", "bio TEXT"]

def sample_service_loop(client, server)

end


print "lolresponse active at port ", PORT.to_s, "\n"
(SimpleServer::SimplerTCP.new PORT, :tokenization).start_loop
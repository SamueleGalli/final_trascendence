require 'socket'
require 'timeout'
load '/var/www/common/Ports.rb' if File.file?("/var/www/common/Ports.rb")
load '../common_tools/tools/Ports.rb' if File.file?("../common_tools/tools/Ports.rb")

if !(File.file?("../common_tools/tools/Ports.rb") || File.file?("/var/www/common/Ports.rb"))
	puts "load file not found"
	exit -1
end

SERVICE_NAME = login

def login(client, server)
	
end

(SimpleServer::SimplerTCP.new PortFinder::FindPort.new(SERVICE_NAME).getPort, :login).start_loop

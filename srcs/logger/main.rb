require 'socket'
require 'timeout'
load '/var/www/common/Ports.rb' if File.file?("/var/www/common/Ports.rb")
load '../common_tools/tools/Ports.rb' if File.file?("../common_tools/tools/Ports.rb")


if !(File.file?("../common_tools/tools/Ports.rb") || File.file?("/var/www/common/Ports.rb"))
	puts "load file not found"
	exit -1
end

$stdout.sync = true
# LOG_FILE_LOCATION = "/var/www/log/logfile.log"

# if (!File.file?(LOG_FILE_LOCATION))
# 	FILE_LOG = File.open(LOG_FILE_LOCATION, "w+")
# else
# 	FILE_LOG = File.open(LOG_FILE_LOCATION, "r+")
# end

# FILE_LOG.sync = true

SERVICE_NAME = 'logger'

def loggering(client, server)
	# puts "log request received" if DEBUG_MODE
	# loop do
	msg = ""
	IO::select([client])
	return if client.closed?
	begin
		while (t = client.read_nonblock(Ports::MAX_MSG_LEN)).size == Ports::MAX_MSG_LEN do
			msg += t
		end
	rescue => r
		return
	end
	msg += t
	msg = '<' + Time.now.strftime("%H:%M").to_s + '> ' + client.addr(true)[2] + ': ' + msg
	puts msg
	FILE_LOG.puts msg
	# end
end

puts "simple logger active"
(SimpleServer::SimplerTCP.new PortFinder::FindPort.new(SERVICE_NAME).getPort, :loggering).start_loop

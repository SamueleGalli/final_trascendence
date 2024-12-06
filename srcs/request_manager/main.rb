# main.rb

# require 'timeout'
require 'json'


load ((File.file? '/var/www/common/Ports.rb') ? '/var/www/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/www/common/RequestUnpacker.rb') ? '/var/www/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')


load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "request_manager"

ALLOW_CLIENT_COMMANDS = true

PGS = BetterPG::SimplePG.new "pages", ["uri TEXT", "content TEXT", "id INT"]
USR = BetterPG::SimplePG.new "users", ["id INT", "username TEXT", "password TEXT", "token TEXT"]

def manage_req(client, server)
	IO::select([client])
	return if client.closed?
	msg = client.read_nonblock Ports::MAX_MSG_LEN
  begin
  	bobj = JSON.parse msg
  rescue => r
    puts r
    raise r
  end

	client.puts "HTTP/1.1 200 OK\r\n\r\nYou ashked fors " + bobj["page"].to_s + "!"
	client.puts bobj

	if bobj["method"].to_s == "new_user"
		if bobj["username"] && bobj["password"]
			id = (USR.select ["MAX(id)"])[0]["max"].to_i
			puts id
			USR.addValues [id + 1, bobj["username"], bobj["password"]]
			client.puts "Added user " + bobj["username"] + "!"
			puts *(USR.select)
			puts 
		end
	end
	if bobj["method"] == "show_users"
		client.puts *(USR.select)
	end

  if bobj["method"] == "exec"
    puts USR.exec bobj["client_command"] rescue r
  end
end

puts "WARNING: Client commands are active and accessible by sending a \"client_command\" field (content will be space joined)"

# print "lolresponse active at port ", PortFinder::FindPort.new(SERVICE_NAME).getPort, "\n"
# (SimpleServer::SimplerTCP.new PortFinder::FindPort.new(SERVICE_NAME).getPort, :manage_req).start_loop

print "lolresponse active at port ", 9001, "\n"
(SimpleServer::SimplerTCP.new 9001, :manage_req).start_loop


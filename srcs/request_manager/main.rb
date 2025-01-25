# main.rb

# require 'timeout'
require 'json'


load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')


load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "request_manager"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

ALLOW_CLIENT_COMMANDS = true

PGS = BetterPG::SimplePG.new "pages", ["uri TEXT", "content TEXT", "id INT"]
USR = BetterPG::SimplePG.new "users", ["id INT", "username TEXT", "password TEXT", "token TEXT"]

def manage_req(client, server)
  IO::select [client], [], [], 10
  return if client.closed?
  r = nil
  msg = client.read_nonblock Ports::MAX_MSG_LEN rescue r
  puts "######", msg, "######"
  bobj = RequestUnpacker::Unpacker.new.unpack msg
  print "rescued ", r, '\n' if r && DEBUG_MODE
  raise r if r

  puts "object not jsoned :(" if !bobj

# 	client.puts "HTTP/1.1 200 OK\r\n\r\nYou ashked fors " + bobj["page"].to_s + "!"
# 	client.puts bobj
#   puts 

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
    puts "Selecting users"
		client.puts *(USR.select)
	end

  if bobj["method"] == "exec"
	puts "executing " + bobj["client_command"].to_s
    res = USR.exec bobj["client_command"].to_s
	client.puts res.to_json
	puts res
	puts res[0]
	
  end
end

puts "WARNING: Client commands are active and accessible by sending a \"client_command\" field (content will be space joined)"

print "lolresponse active at port ", PORT, "\n"
(SimpleServer::SimplerTCP.new PORT, :manage_req).start_loop

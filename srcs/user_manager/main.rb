# main.rb

# require 'timeout'
require 'json'

load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')


load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')

DEFAULT_ERROR_RES = {"status"=>"failed", "success"=>"false"}
DEFAULT_SUCCESS_RES = {"status"=>"success", "success"=>"true"}

$stdout.sync = true
SERVICE_NAME = "user_manager"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

LOGIN = BetterPG::SimplePG.new "users", ["id INT", "login_name TEXT", "name TEXT", "email TEXT", "image TEXT", "bio TEXT", "created NUMERIC"]

def add_user(client, obj = nil)
  r = nil
  puts "add_user called" if DEBUG_MODE
  begin
    max = (LOGIN.exec "SELECT MAX(id) FROM users")[0]
  rescue => r
    max = {"max"=>0}
  end
  data = obj["data"]
  return DEFAULT_ERROR_RES if !data || !data["login_name"] || !data["name"] || !data["email"]
  LOGIN.addValues [max["max"].to_i + 1, data["login_name"], data["name"], data["email"], (Time.now).to_i.to_s], ["id", "login_name", "name", "email", "created"]
  return DEFAULT_SUCCESS_RES
end

def get_user(client, obj = nil)
  puts "get_user called" if DEBUG_MODE
  res = DEFAULT_ERROR_RES
  return res if !obj
  lst = []
  res["status"] = "invalid_request"
  puts obj
  if params = obj["params"]
    puts "looking for user " + params.to_s if DEBUG_MODE
    cols = []
    keys = []
    params.each do | key, val |
      cols.append key.to_s
      keys.append val.to_s
    end
    users = LOGIN.select cols, keys
    users.each do | usr |
      lst.append usr
    end
    res = DEFAULT_SUCCESS_RES
    res["user"] = lst
  end
  return res
end

def update_user(client, obj = nil)
  puts "update_user called" if DEBUG_MODE
  res = DEFAULT_ERROR_RES
  return res if !obj || !(params = obj["new_params"]) || !(lname = obj["login_name"])
  usr = (LOGIN.select ["login_name"], [lname])[0]
  if params.include? "login_name" 
    res["status"] = "Invalid login name change request"
    return res
  end
  params.each do | key, val |
    usr[key] = val
  end
  res["new_usr"] = usr
  # Update database
  return res
end

def user_manager(client, server)
  res = DEFAULT_ERROR_RES
  client.puts "HTTP/1.1 200 OK\r\n\r\n"
  select [client], [], [], 200 # waits for client, a few seconds
  msg = client.read_nonblock 10000
  bobj = RequestUnpacker::Unpacker.new.unpack msg
  puts bobj["method"].to_s
  case bobj["method"].to_s
  when "add_user"
    res = add_user client, bobj
  when "get_user"
    res = get_user client, bobj
  when "update_user"
    res = update_user client, bobj
  else
    res["status"] = "bad method: " + bobj["method"].to_s
    # raise "What the hell"
  end
  client.puts res.to_json
end

puts "user_manager active at port " + PORT.to_s + "\n"
(SimpleServer::SimplerTCP.new PORT, :user_manager).start_loop
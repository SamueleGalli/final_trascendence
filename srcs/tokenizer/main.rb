
# main.rb

# require 'timeout'
require 'digest/bubblebabble'
require 'json'

load ((File.file? '/var/www/common/Ports.rb') ? '/var/www/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "tikenizer"

TOKEN_TIMEOUT = 30

TKS = BetterPG::SimplePG.new "tokens", ["temptoken TEXT", "created NUMERIC"]

def do_hash(msg)
  return Digest::SHA256.bubblebabble msg
end

def purge_tokens()
  TKS.delete ["temptokens", "created"], [], ["created < " + (Time.now.to_i - TOKEN_TIMEOUT).to_s]
  if DEBUG_MODE
    puts "There are " + TKS.select.ntuples.to_s + " tokens left."
  end
end

def token_please(json_obj)
  if json_obj.nil?
    puts "Could not read message. Failed" if DEBUG_MODE
    res = {
      "status"=>"failed",
      "success"=>"false",
      "token"=>""
    }
    return res
  end

  if json_obj["failed_format"].to_s == "true"
    puts "Message is not json format. Hashing entire message as string with time" if DEBUG_MODE
    res = {
      "status"=>"msg not parsed",
      "success"=>"true",
      "token"=>do_hash(msg + (Time.now).to_i.to_s)
    }
    return res
  end

  res = {
    "status"=>"done",
    "success"=>"true",
    "token"=>do_hash(json_obj["username"].to_s + json_obj["password"].to_s + (Time.now).to_i.to_s)
  }
  puts "Done." if DEBUG_MODE
  return res
end

def token_check(json_obj)
  puts "CHECKING TOKEN"
  token = json_obj["token"]
  if token.to_s == ""
    return {"valid"=>"false", "status"=>"bad request"}
  end
  res = TKS.select ["temptoken"], ["'" + token + "'"]
  if res.ntuples.to_i != 0
    return {"valid"=>"true", "status"=>"ok"}
  else
    return {"valid"=>"false", "status"=>"expired"}
  end
end

def tokenization(client, server)
  purge_tokens

  msg = client.read_nonblock 10000 rescue r
  obj = JSON.parse msg rescue r if !msg.nil?
  if !defined?(obj)
    token = token_please(nil)
  elsif obj.nil?
    token = token_please({"failed_format"=>"true", "msg"=>msg})
  elsif obj["token_check"].to_s == "yes"
    token = token_check obj
  else
    token = token_please obj
  end
  client.puts token.to_json rescue r
  if token["success"].to_s == "true"
    TKS.addValues ["'" + token["token"].to_s + "'", Time.now.to_i], ["temptoken", "created"]
  end
end


# PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort
PORT = 7890
# TKS.dropTable

print "lolresponse active at port ", PORT, "\n"
(SimpleServer::SimplerTCP.new PORT, :tokenization).start_loop

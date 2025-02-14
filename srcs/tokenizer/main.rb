
# main.rb

# require 'timeout'
require 'digest/bubblebabble'
require 'json'

load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')


$stdout.sync = true
SERVICE_NAME = "tokenizer"
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

TOKEN_LIFETIME = 30

TKS = BetterPG::SimplePG.new "tokens", ["temptoken TEXT", "created NUMERIC"]

def do_hash(msg)
  return Digest::SHA256.bubblebabble msg
end

def purge_tokens()
  puts "BEGIN PURGE" if DEBUG_MODE
  TKS.delete ["temptokens", "created"], [], ["created < " + (Time.now.to_i - TOKEN_LIFETIME).to_s]
  if DEBUG_MODE
    puts "There are " + TKS.select.count().to_s + " tokens left."
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
      "token"=>do_hash(json_obj["msg"] + (Time.now).to_i.to_s)
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
  puts "CHECKING TOKEN" if DEBUG_MODE
  token = json_obj["token"]
  if token.to_s == ""
    return {"valid"=>"false", "status"=>"bad request"}
  end
  res = TKS.select ["temptoken"], [token]
  if res.ntuples.to_i != 0
    return {"valid"=>"true", "status"=>"ok"}
  else
    return {"valid"=>"false", "status"=>"expired"}
  end
end

def tokenization(client, server)
  purge_tokens
  puts "PURGE END" if DEBUG_MODE
  select [client], [], [], 20 # waits for client, a few seconds

  r = nil
  msg = nil
  msg = client.read_nonblock 10000 rescue r
  obj = JSON.parse msg rescue r if msg
  # client.puts "HTTP/1.1 200 OK\r\n\r\n" if bobj['header'] # parsed an http request
  if msg && (msg.empty? || msg.to_s == '\n')
    token = {"status"=>"no_body_to_hash", "success"=>"false", "token"=>""}
  elsif !defined?(obj)
    token = token_please(nil)
  elsif obj.nil?
    token = token_please({"failed_format"=>"true", "msg"=>msg.to_s})
  elsif obj["token_check"].to_s == "yes" || obj["token_check"].to_s == "true"
    token = token_check obj
  else
    token = token_please obj
  end
  client.puts token.to_json rescue r
  if token["success"].to_s == "true"
    TKS.addValues [token["token"].to_s, Time.now.to_i], ["temptoken", "created"]
  end
end


# TKS.dropTable

print "lolresponse active at port ", PORT, "\n"
(SimpleServer::SimplerTCP.new PORT, :tokenization).start_loop

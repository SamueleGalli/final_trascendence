require 'socket'
require 'timeout'

load(File.file?('/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load(File.file?('/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')

$stdout.sync = true
SERVICE_NAME = 'chat'
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

$connections = {}
$queue = {}

def add_client(client, _server)
  msg = ''
  IO.select([client])
  return if client.closed?

  while (t = client.read_nonblock(Ports::MAX_MSG_LEN)).size == Ports::MAX_MSG_LEN
    msg += t
  end
  msg += t
  client.puts 'HTTP/1.1 200 OK', 'Access-Control-Allow-Origin: *',
              'Access-Control-Allow-Methods: *', ''
  content = RequestUnpacker::Unpacker.new.unpack msg
  login_name = content['login_name']
  if login_name.nil?
    client.puts({ 'status' => 'missing login_name', 'success' => 'false' }.to_json)
    client.close
    raise 'missing login_name'
  end
  if $connections[login_name]
    client.close
    raise 'login_name already connected'
  end

  $connections[login_name] = client
  client.puts({ 'status' => 'connected', 'success' => 'true' }.to_json)
  if my_queue = $queue[login_name]
    my_queue.each do |obj|
      client.puts(obj.to_json)
    end
    $queue[login_name] = nil
  end

  loop do
    select [client]
    if client.closed?
      $connections[login_name] = nil
      puts 'Client closed.'
      return
    end
    msg = client.read_nonblock Ports::MAX_MSG_LEN
    r = nil
    obj = begin
      JSON.parse msg
    rescue StandardError
      r
    end
    next if obj.class != {}.class || obj['to'].nil?

    puts "received message from: #{login_name}", "\tto: #{obj['to']}", "\tcontent: #{obj['msg']}"
    obj['sent'] = Time.now.to_s
    if to = $connections[obj['to']]
      puts "found dude: #{obj['to']}"
      to.puts(obj.to_json)
      next
    end
    if $queue[obj['to']]
      $queue[obj['to']].append obj
    else
      $queue[obj['to']] = [obj]
    end
    puts 'not found, adding to queue'
    puts 'connections be:', $connections
  end
end

puts 'Starting chat server at port ' + PORT.to_s + '!'
(SimpleServer::SimplerTCP.new PORT, :add_client, false).start_loop

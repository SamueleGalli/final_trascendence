require 'socket'
require 'timeout'

load(File.file?('/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load(File.file?('/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')

$stdout.sync = true
SERVICE_NAME = 'receiver'
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

class SimpleGateway
  def initialize(method, client, msg)
    @client = client
    begin
      if DEBUG_MODE
        puts 'looking for method ' + method + ' at service ' + Ports::HASH[method][0] + 'at port ' + Ports::HASH[method][1].to_s
      end
      @socket = TCPSocket.new Ports::HASH[method][0], Ports::HASH[method][1]
      @socket.write(msg)
      loops
    rescue StandardError => e
      if !client.closed? && (!defined?(@socket) || @socket.closed?)
        begin
          client.print "HTTP/1.1 500 Internal Server Error\r\n\r\nError: internal server error: " + e.to_s + "\n"
        rescue StandardError
          e
        end
      end
      puts 'gateway closed (' + e.class.to_s + ')' if DEBUG_MODE
      @socket.close if defined?(@socket) && !@socket.closed?
      raise e if client.closed?
    end
    puts 'gateway closed' if DEBUG_MODE
  end

  def loops
    puts 'starting gateway' if DEBUG_MODE
    loop do
      s = IO.select([@client, @socket])[0][0]
      break if @socket.nil? || @socket.closed? || @client.nil? || @client.closed?

      msg = s.read_nonblock(Ports::MAX_MSG_LEN)
      break if msg == ''

      if s == @socket
        @client.write(msg)
      else
        @socket.write(msg)
      end
    end
  end

  def finalize
    @socket.close
  end
end

def sorter(client, _server)
  loop do
    msg = ''
    IO.select([client])
    return if client.closed?

    while (t = client.read_nonblock(Ports::MAX_MSG_LEN)).size == Ports::MAX_MSG_LEN
      msg += t
    end
    msg += t
    method = msg[0, msg.index(' ').to_i]
    puts msg
    client.puts 'HTTP/1.1 200 OK', 'Connection: close', 'Access-Control-Allow-Origin: *',
                'Access-Control-Allow-Methods: *', ''
    if method == 'OPTIONS'
      t = msg[msg.index('Access-Control-Request-Method: ').to_i..]
      method = t[32, t.index('\r\n').to_i]
    end
    unless Ports::HASH.include? method
      # client.print "HTTP/1.1 405 Method Not Allowed\r\n\r\nError: Method not allowed\n" unless client.closed?
      client.close
      raise "Method Not Allowed (#{method})"
    end
    # FastLogger::LogThis.new "Received " + method.to_s + " request from " + client.addr(true)[2].to_s
    SimpleGateway.new method, client, msg # t.to_json
    return if CLOSE_EVERY_SERVICE_END
  end
end

puts 'Starting server at port ' + PORT.to_s + '!'
(SimpleServer::SimplerTCP.new PORT, :sorter).start_loop

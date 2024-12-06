require 'socket'
require 'timeout'

load ((File.file? '/var/www/common/Ports.rb') ? '/var/www/common/Ports.rb' : '../common_tools/tools/Ports.rb')

load ((File.file? '/var/www/common/RequestUnpacker.rb') ? '/var/www/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')

$stdout.sync = true
SERVICE_NAME = "receiver"

class SimpleGateway
	def initialize(method, client, msg)
		@client = client
		begin
			puts "looking for method " + method + " at service " + Ports::HASH[method][0] + "at port " + Ports::HASH[method][1].to_s if DEBUG_MODE
			@socket = TCPSocket.new Ports::HASH[method][0], Ports::HASH[method][1]
			@socket.write(msg)
			self.loops
		rescue => r
			if !client.closed? && (!defined?(@socket) || @socket.closed?)
        client.print "HTTP/1.1 500 Internal Server Error\r\n\r\nError: internal server error: " + r.to_s + "\n" rescue r
			end
			puts "gateway closed (" + r.class.to_s + ")" if DEBUG_MODE
			@socket.close if defined?(@socket) && !@socket.closed?
			raise r if client.closed?
		end
		puts "gateway closed" if DEBUG_MODE
	end
	def loops
		puts "starting gateway" if DEBUG_MODE
		loop do
			s = IO::select([@client, @socket])[0][0]
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

def sorter(client, server)
	loop do
  	msg = ""
		IO::select([client])
		return if client.closed?
		while (t = client.read_nonblock(Ports::MAX_MSG_LEN)).size == Ports::MAX_MSG_LEN do
			msg += t
		end
		msg += t
		method = msg[0, msg.index(' ').to_i]
		if (!Ports::HASH.include? method)
			client.print "HTTP/1.1 405 Method Not Allowed\r\n\r\nError: Method not allowed\n" if !client.closed?
			client.close
			raise "Method Not Allowed"
		end
		# FastLogger::LogThis.new "Received " + method.to_s + " request from " + client.addr(true)[2].to_s
		print (t = RequestUnpacker::Unpacker.new.unpack msg).to_json
		SimpleGateway.new method, client, t.to_json
		if CLOSE_EVERY_SERVICE_END
			return
		end
	end
end

puts "Starting server!"
s = SimpleServer::SimplerTCP.new 8008, :sorter
s.start_loop

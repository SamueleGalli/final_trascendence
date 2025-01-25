# Ports.rb

module Ports
  HASH = {
    # sample:
    #"method" => ["service_to_call", port_to_service]
    # "GET" => ["localhost", 9001],
    # "HEAD" => ["localhost", 9090],
    # "log" => ["localhost", 8001],

    "GET" => ["auth", 9292],
    "POST" => ["request_manager", 9000],
    "HEAD" => ["request_manager", 9000],
    "show_users" => ["request_manager", 9000],
    "TOKEN" => ["tokenizer", 7890],
    "" => ["receiver", 8008],
    "add_user" => ["user_manager", 7080],
    "get_user" => ["user_manager", 7080],
    "update_user" => ["user_manager", 7080]
  }
  MAX_MSG_LEN = 100000
end

module FastLogger
  class LogThis
    def initialize(msg)
      socket = TCPSocket.new Ports::HASH["log"][0], Ports::HASH["log"][1]
      if !socket.closed?
        socket.print msg if msg.class.to_s == "String"
        socket.close
      end
    end
  end
end

module PortFinder
  class FindPort
    @@port = -1
    def initialize(name)
      Ports::HASH.each do |key, val|
        if val[0] == name
          @@port = val[1]
          return
        end
      end
      puts "Port not found. Returning crash"
    end
    def getPort
      return @@port
    end
  end
end

def announceAddress()
  addr_infos = Socket.ip_address_list
  s = ""
  addr_infos.each do |addr_info|
    next if !addr_info.ip_address.to_s.include? "172."
    s << ' '
    s << addr_info.ip_address
  end
  puts "My addresses:" + s
end

module SimpleServer

	class SimplerTCP
    include FastLogger
		@@server
    @@function
    @@tokens
		def initialize(port, funct = nil, logs = false)
      announceAddress
			@@server = TCPServer.new port
			@@function = funct
      @@logs = logs
		end
    def start_loop
      loop {
        Thread.start(@@server.accept) do |client|
          begin
            method(@@function).call(client, self)
          # rescue => r
					# 	puts "Catched: " + r.to_s + "(" + r.class.to_s + ")\n" + r.backtrace.join("\n") if DEBUG_MODE
          #   client.close if !client.closed?
          end
          client.close if !client.closed?
          puts "Connection concluded" if DEBUG_MODE
        end
      }
		end
    def setFunction(server_side_function)
      @@function = server_side_function
    end
	end
end

DEBUG_MODE = true
CLOSE_EVERY_SERVICE_END = true

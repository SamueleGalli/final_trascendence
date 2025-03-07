# Ports.rb

module Ports
  HASH = {
    # sample:
    # "method" => ["service_to_call", port_to_service]
    # "GET" => ["localhost", 9001],
    # "HEAD" => ["localhost", 9090],
    # "log" => ["localhost", 8001],

    '' => ['receiver', 8008],
    'GET' => ['auth', 9292],
    'POST' => ['request_manager', 9000],
    'HEAD' => ['request_manager', 9000],
    'show_users' => ['request_manager', 9000],
    'tokenizer' => ['tokenizer', 7890],
    'add_user' => ['user_manager', 7080],
    'get_user' => ['user_manager', 7080],
    'drop_users' => ['user_manager', 7080],
    'update_user' => ['user_manager', 7080],
    'game_manager' => ['game_manager', 7878],
    'history_manager' => ['history_manager', 7701],
    'chat' => ['chat', 6087],

    'save_pong_game' => ['game_data_manager', 8790],
    'get_pong_games' => ['game_data_manager', 8790],
    'save_f4_game' => ['game_data_manager', 8790],
    'get_f4_games' => ['game_data_manager', 8790],
    'get_all_games' => ['game_data_manager', 8790]
  }
  MAX_MSG_LEN = 100_000
end

module FastLogger
  class LogThis
    def initialize(msg)
      socket = TCPSocket.new Ports::HASH['log'][0], Ports::HASH['log'][1]
      return if socket.closed?

      socket.print msg if msg.class.to_s == 'String'
      socket.close
    end
  end
end

module PortFinder
  class FindPort
    @@port = -1
    def initialize(name)
      Ports::HASH.each do |_key, val|
        if val[0] == name
          @@port = val[1]
          return
        end
      end
      puts 'Port not found. Returning crash'
    end

    def getPort
      @@port
    end
  end
end

def announceAddress
  addr_infos = Socket.ip_address_list
  s = ''
  addr_infos.each do |addr_info|
    next unless addr_info.ip_address.to_s.include? '172.'

    s << ' '
    s << addr_info.ip_address
  end
  puts 'My addresses:' + s
end

module SimpleServer
  # JSON object (not in string form)
  def self.method_req(method, msg = '', do_close = true)
    raise "Bad method request (#{method})" if Ports::HASH[method].nil?
    puts "Resolving host: #{Ports::HASH[method][0]}".red
    service = TCPSocket.new Ports::HASH[method][0], Ports::HASH[method][1]
    msg['method'] = method
    service.write msg.to_json if msg
    IO.select [service], [], [], 1
    res = service.read_nonblock Ports::MAX_MSG_LEN
    service.close if do_close
    return [service, res] unless do_close

    res
  end

  class SimplerTCP
    include FastLogger
    def initialize(port, funct = nil, close = true)
      announceAddress
      @@server = TCPServer.new port
      @@function = funct
      @@close = close
    end

    def start_loop
      loop do
        Thread.start(@@server.accept) do |client|
          begin
            method(@@function).call(client, self)
            # rescue => r
            # 	puts "Catched: " + r.to_s + "(" + r.class.to_s + ")\n" + r.backtrace.join("\n") if DEBUG_MODE
          end
          client.close if @@close && !client.closed?
          puts 'Connection concluded' if DEBUG_MODE
        end
      end
    end

    def setFunction(server_side_function)
      @@function = server_side_function
    end
  end
end

DEBUG_MODE = true
CLOSE_EVERY_SERVICE_END = true

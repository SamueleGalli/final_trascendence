# main.rb

# require 'timeout'
require 'json'

# load ((File.file? '/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../common_tools/tools/Ports.rb')

# load ((File.file? '/var/common/RequestUnpacker.rb') ? '/var/common/RequestUnpacker.rb' : '../common_tools/tools/RequestUnpacker.rb')

# load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../common_tools/tools/BetterPG.rb')

Dir['/var/common/*.rb'].each { |file| require file }

DEFAULT_ERROR_RES = { 'status' => 'failed', 'success' => 'false' }
DEFAULT_SUCCESS_RES = { 'status' => 'success', 'success' => 'true' }

$stdout.sync = true
SERVICE_NAME = 'game_data_manager'
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

GAMES_PONG = BetterPG::SimplePG.new 'pong_games_history', ['player1 TEXT', 'player2 TEXT', 'score1 INT', 'score2 INT', 'winner TEXT', 'begin_time INT', 'duration INT', 'longest_rally INT']
GAMES_F4 = BetterPG::SimplePG.new 'forza4_games_history', ['player1 TEXT', 'player2 TEXT', 'winner TEXT', 'moves INT', 'begin_time INT', 'duration INT']
LOGIN = BetterPG::SimplePG.new 'users', ['realname TEXT', 'wins INT', 'loss INT']

def get_pong(obj)
  puts 'get_pong called'
  name = obj['realname']
  games = GAMES_PONG.select(['player1', 'player2'], [name, name], [], 'OR')
  return { 'status'=> (games.empty? ? 'no games ever played' : 'success'), 'success'=>'true', 'games'=>games }
end

def save_pong(obj)
  puts 'save_pong called'
  return {'status' => 'missing game params', 'success' => 'false'} unless (%w[player1 player2 score1 score2 begin_time longest_rally] - obj.keys).empty?
  obj['winner'] = obj['player1'] if obj['score1'].to_i > obj['score2'].to_i
  obj['winner'] = obj['player2'] if obj['score1'].to_i < obj['score2'].to_i
  obj['winner'] ||= 'tie'
  # obj['duration'] = Time.now.to_i - obj['begin_time'].to_i
  obj['duration'] = obj['begin_time']
  obj = obj.slice(*(obj.keys & GAMES_PONG.getColumns))
  GAMES_PONG.addValues obj.values, obj.keys

  puts 'game saved!'
  return DEFAULT_SUCCESS_RES
end

def get_f4(obj)
  puts 'get_f4 called'
  name = obj['realname']
  games = GAMES_F4.select(['player1', 'player2'], [name, name], [], 'OR')
  return { 'status'=> (games.empty? ? 'no games ever played' : 'success'), 'success'=>'true', 'games'=>games }
end

def save_f4(obj)
  puts 'save_f4 called'
  return {'status' => 'missing game params', 'success' => 'false'} unless (%w[player1 player2 winner moves begin_time] - obj.keys).empty?
  # obj['duration'] = Time.now.to_i - obj['begin_time'].to_i
  obj['duration'] = obj['begin_time']
  obj = obj.slice(*(obj.keys & GAMES_F4.getColumns))
  GAMES_F4.addValues obj.values, obj.keys

  puts 'game saved!'
  return DEFAULT_SUCCESS_RES
end

def get_all_games()
  return GAMES_PONG.select + GAMES_F4.select
end

def drop_games()
  GAMES_PONG.dropTable
  GAMES_F4.dropTable
  exit
end

def game_data_manager(client, _server)
  t = select [client], [], [], 20 # waits for client, a few seconds
  return if t[0].empty? || client.closed?

  msg = client.read_nonblock Ports::MAX_MSG_LEN
  bobj = RequestUnpacker::Unpacker.new.unpack msg

  puts bobj.to_json
  
  res = case bobj['method'].to_s
  when 'get_pong_games'
    get_pong bobj
  when 'save_pong_game'
    save_pong bobj
  when 'get_f4_games'
    get_f4 bobj
  when 'save_f4_game'
    save_f4 bobj
  when 'get_all_games'
    get_all_games
  when 'drop_games'
    drop_games
  else
    {'status' => 'bad method', 'success' => 'false'}
  end
  client.puts res.to_json
end

puts 'game_data_manager active at port ' + PORT.to_s + "\n"
(SimpleServer::SimplerTCP.new PORT, :game_data_manager).start_loop

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
SERVICE_NAME = 'user_manager'
PORT = PortFinder::FindPort.new(SERVICE_NAME).getPort

LOGIN = BetterPG::SimplePG.new 'users',
                               ['id INT', 'display_name TEXT', 'realname TEXT', 'email TEXT', 'image TEXT', 'bio TEXT',
                                'created NUMERIC', 'num_friends NUMERIC', 'friends_list TEXT[]', 'entered INT', 'type TEXT', 'level FLOAT']

# REQUIRED_FOR_ADDUSER = %w[email display_name realname bio image type]

def add_user(_client, obj = nil)
  puts 'add_user called' if DEBUG_MODE
  begin
    max = (LOGIN.exec 'SELECT MAX(id) FROM users')[0]
  rescue StandardError => e
    max = { 'max' => 0 }
  end
  data = obj # ['data']

  return { 'status' => 'missing realname', 'success' => 'false' } if data['realname'].nil?

  begin
    if (LOGIN.select ['realname'], [data['realname']])[0]
      puts "user already present (#{data['realname']})".red
      return { 'status' => 'user with same login_name already in database', 'success' => 'false' }
    end
  rescue StandardError
    e
  end

  fields = LOGIN.getColumns
  values = {}

  fields.each do |f|
    values[f] = data[f] if data[f]
  end
  values['id'] = max['max'].to_i
  puts "inserting new user: #{values}"
  LOGIN.addValues values.values, values.keys
  # LOGIN.addValues [max['max'].to_i + 1, data['login_name'], data['name'], data['email'], Time.now.to_i.to_s],
  #                 %w[id login_name name email created]
  DEFAULT_SUCCESS_RES
end

def get_user(_client, obj = nil)
  puts 'get_user called' if DEBUG_MODE
  res = DEFAULT_ERROR_RES
  return res unless obj

  lst = []
  res['status'] = 'invalid request'
  params = obj['params']
  params = [params] if params.class.to_s == 'Hash'
  if params.class.to_s == 'Array'
    puts 'looking for users with ' + params.to_s if DEBUG_MODE
    params.each do |p|
      cols = []
      keys = []
      p.each do |key, val|
        return DEFAULT_ERROR_RES if key.nil? || key.empty?

        cols.append key.to_s
        keys.append val.to_s
      end
      users = LOGIN.select cols, keys
      users = [] if users == [{}]
      users.each do |usr|
        lst.append usr
      end
    end
    res = DEFAULT_SUCCESS_RES
    res['status'] = 'no users found' if lst.empty?
    res['user'] = lst
  end
  if params.nil? || params.empty?
    users = LOGIN.select
    # puts "####", users
    res = DEFAULT_SUCCESS_RES
    res['status'] = 'no users found' if users.empty?
    res['user'] = users
  end
  res
end

def update_user(_client, obj = nil)
  puts 'update_user called' if DEBUG_MODE
  r = nil
  res = DEFAULT_ERROR_RES
  return res if !obj || !(params = obj['new_params']) || !(lname = obj['display_name'])
  return { 'status' => 'Invalid login name change request', 'success' => 'false' } if params.include? 'display_name'

  # (LOGIN.select ["display_name"], [lname])[0] rescue r
  usr = begin
    (LOGIN.select ['display_name'], [lname])[0]
  rescue StandardError
    r
  end
  return { 'status' => 'display_name not found', 'success' => 'false' } if r || usr.nil?

  cols = []
  keys = []
  params.each do |key, val|
    cols.append key.to_s
    keys.append val.to_s
  end

  LOGIN.update cols, keys, "display_name = '" + lname + "'"
  DEFAULT_SUCCESS_RES
end

def drop_users(_client, _obj = nil)
  does = 'yesiam' # obj['reallysure']
  if does.to_s == 'yesiam'
    LOGIN.dropTable
    exit
  end
  DEFAULT_ERROR_RES
end

def user_manager(client, _server)
  res = DEFAULT_ERROR_RES
  t = select [client], [], [], 20 # waits for client, a few seconds
  return if t[0].empty? || client.closed?

  msg = client.read_nonblock Ports::MAX_MSG_LEN
  bobj = RequestUnpacker::Unpacker.new.unpack msg
  puts bobj
  # client.puts "HTTP/1.1 200 OK\r\n\r\n" if bobj['header'] # parsed an http request
  case bobj['method'].to_s
  when 'add_user'
    res = add_user client, bobj
  when 'get_user'
    res = get_user client, bobj
  when 'update_user'
    res = update_user client, bobj
  when 'drop_users'
    res = drop_users client, bobj
  else
    res['status'] = 'bad method: ' + bobj['method'].to_s
    puts 'no method called'
    # raise "What the hell"
  end
  client.puts res.to_json
end

puts 'user_manager active at port ' + PORT.to_s + "\n"
(SimpleServer::SimplerTCP.new PORT, :user_manager).start_loop

require 'json'
require 'pg'
require 'colorize'
load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../../common_tools/tools/BetterPG.rb')

login = BetterPG::SimplePG.new "users", ["login_name TEXT", "name TEXT", "email TEXT", "image TEXT", "token TEXT"]

module Other_logic
  def not_found(response)
    response.status = 404
    response.content_type = 'application/json'
    response.write({ success: false, error: "Not Found" }.to_json)
  end

  def get_user_data_from_oauth_provider(token)
    uri = URI("https://api.intra.42.fr/v2/me")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
  
    if response.code.to_i == 200
      user_data = JSON.parse(response.body)
    else
      puts "Errore API 42: #{response.code}"
      return nil
    end

        name = user_data['usual_full_name']
        email = user_data['email']
        image = user_data['image']
        login_name = user_data['login']
        puts "\nDati ricevuti dall'API di 42:".green
        puts "       name: #{name}".green
        puts "       email: #{email}".green
        puts "       image: #{image}".green
        puts "  login_name: #{login_name}".green
    if image.nil? || image.empty?
      image = 'nulla'
    end
    return { 'login_name' => login_name, 'name' => name, 'email' => email, 'avatar_url' => image }

    login.addValues([login_name, name, email, image, token], ["login_name", "name", "email", "image", "token"])
  end
end

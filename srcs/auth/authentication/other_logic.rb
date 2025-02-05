
require 'json'
require 'pg'
require 'colorize'
#load ((File.file? '/var/common/BetterPG.rb') ? '/var/common/BetterPG.rb' : '../../common_tools/tools/BetterPG.rb')

#LOGIN = BetterPG::SimplePG.new "users", ["login_name TEXT", "name TEXT", "email TEXT", "image TEXT", "bio TEXT", "id INT"]

module Other_logic
  def not_found(response)
    response.redirect('/')
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
        image = user_data['image']['link']
        login_name = user_data['login']
    #LOGIN.addValues ["'" + login_name.to_s + "'", "'" + name.to_s+ "'" , "'" + email.to_s + "'"], ["login_name", "name", "email"]
    return { 'login_name' => login_name, 'name' => name, 'email' => email, 'image' => image }
  end
end

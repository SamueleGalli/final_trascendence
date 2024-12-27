require 'json'
require 'pg'
#load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../../common_tools/tools/BetterPG.rb')

#login = BetterPG::SimplePG.new "users", ["name TEXT", "email TEXT", "image TEXT", token TEXT"]

module Other_logic
  def not_found(response)
    response.status = 404
    response.content_type = 'application/json'
    response.write({ success: false, error: "Not Found" }.to_json)
  end

  def get_user_data_from_oauth_provider(token)
    uri = URI("https://api.intra.42.fr/v2/me")  # Endpoint per i dati utente
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"  # Usa il token di accesso ottenuto

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
  
    if response.code.to_i == 200
      user_data = JSON.parse(response.body)
    else
      puts "Errore API 42: #{response.code}"
      return nil
    end

    name = user_data['first_name'] + " " + user_data['last_name']
    email = user_data['email']
    image = user_data['avatar_url'] || 'default_image_url'

    puts "User data: #{user_data.inspect}"  # Mostra l'intero oggetto restituito dall'API

    if image.nil? || image.empty?
      image = 'nulla'
    end
    puts "Name: #{name}, Email: #{email}, Image URL: #{image}"

    return { 'name' => name, 'email' => email, 'avatar_url' => image }

    #login.addValues ["'" + name + "'", "'" + email + "'" , "'" + image + "'", "'" +"token" + "'"], ["name", "email", "image", "token"] 
  end
end

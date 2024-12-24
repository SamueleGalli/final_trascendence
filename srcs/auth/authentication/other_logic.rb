require 'json'
require 'pg'
#load ((File.file? '/var/www/common/BetterPG.rb') ? '/var/www/common/BetterPG.rb' : '../../common_tools/tools/BetterPG.rb')

#login = BetterPG::SimplePG.new "users", ["name TEXT", "email TEXT", "image TEXT"]

module Other_logic
  def guest(request, response)
    # Gestione della route POST /guest
    if request.request_method == 'POST'
      guest_name = CGI.escapeHTML(request.params['guest_name'])
     # login.addValues ["'" + guest_name + "'", "'" + NULL + "'" , "'" + NULL + "'"], ["name", "email", "image"] 
      if guest_name.nil? || guest_name.strip.empty?
        response.status = 400
        response.write({ success: false, error: "Guest name is required" }.to_json)
      else
        response.write({ success: true, guest_name: guest_name }.to_json)
        # Salva il nome del guest nella sessione
        request.session[:guest_name] = guest_name
        response.write({ success: true, guest_name: guest_name }.to_json)
      end
    else
      response.status = 404
      response.write({ success: false, error: "Not Found" }.to_json)
    end
  end

  def not_found(response)
    response.status = 404
    response.content_type = 'application/json'
    response.write({ success: false, error: "Not Found" }.to_json)
  end

  def get_user_data_from_oauth_provider(token)
    uri = URI("https://api.github.com/user")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"
  
    # Fai la richiesta
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
  
    # Elabora la risposta JSON
    user_data = JSON.parse(response.body)
  
    name = user_data['name']
    email = user_data['email']
    image = user_data['avatar_url']  
    #login.addValues ["'" + name + "'", "'" + email + "'" , "'" + image + "'"], ["name", "email", "image"] 
  end
end

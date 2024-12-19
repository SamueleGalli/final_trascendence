require 'json'
module Other_logic
  def guest(request, response)
    # Gestione della route POST /guest
    if request.request_method == 'POST'
      guest_name = CGI.escapeHTML(request.params['guest_name'])
      response.write({ success: true, guest_name: guest_name }.to_json)
      
      if guest_name.nil? || guest_name.strip.empty?
        response.status = 400
        response.write({ success: false, error: "Guest name is required" }.to_json)
      else
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
  
      {
        'name' => CGI.escapeHTML(user_data['name']),
        'email' => CGI.escapeHTML(user_data['email']),
        'avatar_url' => CGI.escapeHTML(user_data['avatar_url'])
      }
    end
    
end

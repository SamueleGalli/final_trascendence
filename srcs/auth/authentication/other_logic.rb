
require 'json'
require 'pg'
require 'colorize'
require 'logger'

module Other_logic

  def page_not_found(response)
    response.status = 200
    html_content = File.read('./pages_auth/no_page.html')
    response.content_type = 'text/html  '
    response.write(html_content)
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
    #array di utenti della 42 per controllare login_name
        name = user_data['usual_full_name']
        email = user_data['email']
        image = user_data['image']['link']
        login_name = user_data['login']
    #LOGIN.addValues ["'" + login_name.to_s + "'", "'" + name.to_s+ "'" , "'" + email.to_s + "'"], ["login_name", "name", "email"]
    return { 'login_name' => login_name, 'name' => name, 'email' => email, 'image' => image }
  end

end

#def get_user_data_from_oauth_provider(token)
#  uri = URI("https://api.intra.42.fr/v2/me")
#  request = Net::HTTP::Get.new(uri)
#  request["Authorization"] = "Bearer #{token}"
#
#  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
#    http.request(request)
#  end
#
#  payload = { name: name, email: email, image: image, login_name: login_name }.to_json
#
#  send_data_to_server("http://localhost:8008", payload)
#  else
#    puts "Errore API 42: #{response.code}"
#  end
#end
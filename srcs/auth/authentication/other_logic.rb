
require 'json'
require 'pg'
require 'colorize'
require 'logger'

require_relative ((File.file?('/var/common/Ports.rb') ? '/var/common/Ports.rb' : '../../common_tools/tools/Ports.rb'))

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
    realname = user_data['usual_full_name']
    email = user_data['email']
    image = user_data['image']['link']
    display_name = user_data['login']
    payload = { realname: realname, email: email, image: image, display_name: display_name, entered: 1}
    puts "finished with user data".green

    SimpleServer.method_req("add_user", payload)
    puts "proseguing login".green
  end
end
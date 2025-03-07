# RequestUnpacker.rb

require 'json'

# usage: RequestUnpacker::Unpacker.new.unpack(msg)
module RequestUnpacker
  class Unpacker
    DEFAULT_RETURN_PAGE = {"method" => "request_page", "path" => "index.html"}
    def query_string_json(qs="")
      obj = {}
      vars = qs.split("&")
      vars.each do |s|
        t = s.index("=").to_i
        obj[s[..t - 1]] = s[t + (t ? 1 : 0)..]
      end
      return obj
    end

    def header_json(head="")
      obj = {}
      vars = head.split("\r\n")
      vars.each do |s|
        t = s.index(":").to_i
        obj[s[..t - 1]] = s[t + (t ? 2 : 0)..]
      end
      return obj
    end

    def get_req_details(fr)
      # puts "# creating request" if DEBUG_MODE
      request = fr[0..fr.index(" ").to_i - 1]
      fr = fr[request.size.to_i + 1..-1]
      return [request] if fr.nil?
      # puts "# creating url" if DEBUG_MODE
      t = fr.index("?")
      url = (t ? fr[0, t] : fr[0..fr.index(" ").to_i-1])
      fr = fr[url.size.to_i + 1..-1]
      return [request, url] if fr.nil? || t.nil?
      # puts "# creating qs" if DEBUG_MODE
      qs = fr[0..fr.index(" ").to_i - 1]
      return [request, url, qs]
    end

    def unpack(msg)
      r = nil
      req_info = JSON.parse msg.to_s rescue r
      return req_info if req_info
      req_info = {}
      (request, path, query_string) = get_req_details(msg[0,msg.index("\n").to_i])
    
      puts "unpacked: '" + request.to_s + "'" + " for " + path.to_s + ". QS: '" + query_string.to_s + "'" if DEBUG_MODE
      head = msg[msg.index("\r\n") + 2..msg.index("\r\n\r\n").to_i - 1] if msg.index("\r\n")
      begin
        req_info.merge! JSON.parse msg[msg.index("\r\n\r\n").to_i + 4..].to_s
      rescue JSON::ParserError => r
        req_info["body_text"] = msg[msg.index("\r\n\r\n").to_i + 4..].to_s
      end
      req_info["query_string"] = query_string_json(query_string) if query_string
      req_info["header"] = header_json(head) if head
      req_info["method"] = request.empty? ? DEFAULT_RETURN_PAGE["method"] : request
      req_info["path"] = request.empty? ? DEFAULT_RETURN_PAGE["path"] : path
      # puts
      # puts bodyobj["header"]
      # print "\n\n"
      return req_info
    end
  end
end
def set_routes(server)
    public_dir = File.expand_path("../../public", __FILE__)
    website_dir = File.join(public_dir, "website")
    
    server.mount "/website/css", WEBrick::HTTPServlet::FileHandler, File.join(website_dir, "css")
    server.mount "/website/js", WEBrick::HTTPServlet::FileHandler, File.join(website_dir, "js")
    server.mount "/website/images", WEBrick::HTTPServlet::FileHandler, File.join(website_dir, "images")
    server.mount "/favicon.ico", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "favicon.ico")
end